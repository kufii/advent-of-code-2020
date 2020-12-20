import input from './input'
import dedent from 'dedent'
import { FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Visualize } from '/components'
import {
  clone2dArray,
  make2dArray,
  output2dArray,
  parse2dArray,
  product
} from '/utilities'
import { m } from '/vdom'

type Tile = string[][]
interface TileWithKey {
  key: number
  tile: Tile
}
type Stitched = (TileWithKey | null)[][]

const parseInput = (): TileWithKey[] =>
  input.split('\n\n').map((block) => ({
    key: Number(block.split('\n')[0].match(/Tile (?<key>\d+)/u)!.groups!.key),
    tile: parse2dArray(block.split('\n').slice(1).join('\n'))
  }))

const flip = (tile: Tile) => clone2dArray(tile).reverse()

const rotate = (tile: Tile) =>
  tile[0].map((_, index) => tile.map((row) => row[index]).reverse())

const getTransforms = function* (tile: Tile) {
  yield tile
  for (let n = 0; n < 2; n++) {
    for (let r = 0; r < 3; r++) {
      tile = rotate(tile)
      yield tile
    }
    if (n === 0) {
      tile = flip(tile)
      yield tile
    }
  }
}

const topMatches = (tile: Tile, matches: Tile) =>
  tile[0].every((c, x) => matches[matches.length - 1][x] === c)

const leftMatches = (tile: Tile, matches: Tile) =>
  tile.every((line, y) => matches[y][matches[y].length - 1] === line[0])

const stitch = function* (tiles: TileWithKey[], yieldEvery = 100) {
  const size = Math.sqrt(tiles.length)
  const getPos = (index: number) => ({
    x: index % size,
    y: Math.floor(index / size)
  })

  let n = 0
  for (const start of tiles.flatMap(({ key, tile }) =>
    [...getTransforms(tile)].map((tile) => ({ key, tile }))
  )) {
    const array = make2dArray<TileWithKey | null>(size, size, null)
    const keys = new Set([start.key])
    array[0][0] = start
    let i = 1

    while (i < tiles.length) {
      if (n++ % yieldEvery === 0) yield
      const { x, y } = getPos(i)
      const remainingTiles = tiles.filter(({ key }) => !keys.has(key))
      const next = remainingTiles
        .map(({ key, tile }) =>
          [...getTransforms(tile)]
            .map((tile) => ({ key, tile }))
            .find(
              ({ tile }) =>
                (x === 0 || leftMatches(tile, array[y][x - 1]!.tile)) &&
                (y === 0 || topMatches(tile, array[y - 1][x]!.tile))
            )
        )
        .find(Boolean)
      if (!next) break
      array[y][x] = next
      keys.add(next.key)
      i++
    }

    if (i >= tiles.length) return yield array
  }
}

const merge = (tiles: Tile[][]) => {
  let result = ''
  for (const tileRow of tiles) {
    for (let i = 0; i < tileRow[0].length; i++) {
      result += tileRow.map((tile) => tile[i].join('')).join('') + '\n'
    }
  }
  return result.trim()
}

const findSeaMonsters = (tile: Tile) => {
  const monster = parse2dArray(
    dedent`
      ..................#.
      #....##....##....###
      .#..#..#..#..#..#...
    `.trim()
  )

  for (const t of getTransforms(tile)) {
    let found = false
    for (let y = 0; y < t.length - monster.length; y++) {
      for (let x = 0; x < t[0].length - monster[0].length; x++) {
        const match = monster.every((line, my) =>
          line.every((c, mx) => c !== '#' || t[y + my][x + mx] === '#')
        )
        if (match) {
          found = true
          monster.forEach((line, my) =>
            line.forEach((c, mx) => {
              if (c === '#') t[y + my][x + mx] = 'O'
            })
          )
        }
      }
    }
    if (found) return t
  }
}

const StitchedLoader = ({
  render
}: {
  render: FunctionComponent<{ stitched: Stitched }>
}) => {
  const [stitched, setStitched] = useState<Stitched | null>(null)

  useEffect(() => {
    const gen = stitch(parseInput())
    const interval = setInterval(() => {
      const { value, done } = gen.next()
      if (value) {
        setStitched(value)
        clearInterval(interval)
      } else if (done) {
        clearInterval(interval)
      }
    }, 0)
    return () => clearInterval(interval)
  }, [])

  if (!stitched) return m('div', 'Running...')

  return m(render, { stitched })
}

export const Part1 = () =>
  m(StitchedLoader, {
    render: ({ stitched }: { stitched: Stitched }) => {
      const result = [stitched[0], stitched[stitched.length - 1]]
        .flatMap((line) => [line[0]!.key, line[line.length - 1]!.key])
        .reduce(product)
      const merged = merge(
        stitched.map((tileRow) => tileRow.map((t) => t!.tile))
      )
      return m(
        'div',
        'The product of the keys in the 4 corners is ',
        m('strong', result),
        '.',
        m(Visualize, merged)
      )
    }
  })

export const Part2 = () =>
  m(StitchedLoader, {
    render: ({ stitched }: { stitched: Stitched }) => {
      const map = parse2dArray(
        merge(
          stitched.map((tileRow) =>
            tileRow.map((t) =>
              t!.tile.slice(1, -1).map((line) => line.slice(1, -1))
            )
          )
        )
      )
      const mapWithMonsters = output2dArray(findSeaMonsters(map)!)
      const result = mapWithMonsters.match(/#/gu)!.length
      return m(
        'div',
        m('strong', result),
        ' #s are not part of a sea monster.',
        m(Visualize, mapWithMonsters)
      )
    }
  })
