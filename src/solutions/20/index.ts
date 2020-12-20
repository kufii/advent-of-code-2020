import { FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import input from './input'
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
type Stitched = ({ key: number; tile: Tile } | null)[][]

const parseInput = (): Record<number, Tile> =>
  input.split('\n\n').reduce(
    (acc, block) => ({
      ...acc,
      [Number(
        block.split('\n')[0].match(/Tile (?<key>\d+)/u)!.groups!.key
      )]: parse2dArray(block.split('\n').slice(1).join('\n'))
    }),
    {}
  )

const flip = (tile: Tile) => clone2dArray(tile).reverse()

const rotate = (tile: Tile) =>
  tile[0].map((_, index) => tile.map((row) => row[index]).reverse())

const getTransformFns = function* () {
  yield (tile: Tile) => tile
  yield (tile: Tile) => rotate(tile)
  yield (tile: Tile) => rotate(tile)
  yield (tile: Tile) => rotate(tile)
  yield (tile: Tile) => flip(tile)
  yield (tile: Tile) => rotate(tile)
  yield (tile: Tile) => rotate(tile)
  yield (tile: Tile) => rotate(tile)
}

const getTransforms = function* (tile: Tile) {
  for (const fn of getTransformFns()) {
    tile = fn(tile)
    yield tile
  }
}

const topMatches = (tile: Tile, matches: Tile) =>
  tile[0].every((c, x) => matches[matches.length - 1][x] === c)

const leftMatches = (tile: Tile, matches: Tile) =>
  tile.every((line, y) => matches[y][matches[y].length - 1] === line[0])

const stitch = function* (tiles: Record<number, Tile>, yieldEvery = 50) {
  const tileArray = Object.entries(tiles).map(([key, tile]) => ({
    key: Number(key),
    tile
  }))
  const size = Math.sqrt(tileArray.length)
  const getPos = (index: number) => ({
    x: index % size,
    y: Math.floor(index / size)
  })

  const recurse = function* (
    array: Stitched,
    keys: number[] = [],
    i = 0
  ): IterableIterator<Stitched | null> {
    const remainingTiles = tileArray.filter(({ key }) => !keys.includes(key))
    const { x, y } = getPos(i)
    const validTiles = remainingTiles.flatMap(({ key, tile }) =>
      [...getTransforms(tile)]
        .filter(
          (tile) =>
            (x === 0 || leftMatches(tile, array[y][x - 1]!.tile)) &&
            (y === 0 || topMatches(tile, array[y - 1][x]!.tile))
        )
        .map((tile) => ({ key, tile }))
    )
    for (const tile of validTiles) {
      array[y][x] = tile
      if (i === tileArray.length - 1) yield array
      yield* recurse(clone2dArray(array), [...keys, tile.key], i + 1)
    }
    yield null
  }

  let n = 0
  for (const result of recurse(
    make2dArray<{ key: number; tile: Tile } | null>(size, size, null)
  )) {
    if (result) return yield result
    if (n++ % yieldEvery === 0) yield null
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
    `
..................#.
#....##....##....###
.#..#..#..#..#..#...
  `.trim()
  )

  for (const fn of getTransformFns()) {
    tile = fn(tile)
    for (let y = 0; y < tile.length - monster.length; y++) {
      for (let x = 0; x < tile[0].length - monster[0].length; x++) {
        const match = monster.every((line, my) =>
          line.every((c, mx) => c === '.' || tile[y + my][x + mx] === '#')
        )
        if (match)
          monster.forEach((line, my) =>
            line.forEach((c, mx) => {
              if (c === '#') tile[y + my][x + mx] = 'O'
            })
          )
      }
    }
  }
  return tile
}

export const StitchedLoader = ({
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

  if (!stitched) return m('div', 'Running... This takes a while...')

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
        'The product of the keys of the 4 corners is ',
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
      const mapWithMonsters = output2dArray(findSeaMonsters(map))
      const result = mapWithMonsters.match(/#/gu)!.length
      return m(
        'div',
        m('strong', result),
        ' #s are not part of a sea monster.',
        m(Visualize, mapWithMonsters)
      )
    }
  })
