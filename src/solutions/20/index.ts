import input from './input'
import dedent from 'dedent'
import { Answer, Visualize } from '/components'
import {
  clone2dArray,
  make2dArray,
  nestedLoop,
  output2dArray,
  parse2dArray,
  product
} from '/utilities'
import { m, z } from '/vdom'

type Tile = string[][]
interface TileWithKey {
  key: number
  tile: Tile
}

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

const getEdges = (tile: Tile) => [
  tile[0].join(''),
  tile[tile.length - 1].join(''),
  tile.map((row) => row[0]).join(''),
  tile.map((row) => row[row.length - 1]).join('')
]

const isCorner = (tiles: TileWithKey[], tile: TileWithKey) =>
  getEdges(tile.tile).filter((edge) =>
    tiles
      .filter((t) => t.key !== tile.key)
      .every(
        (t) =>
          !getEdges(t.tile).some(
            (edge2) => edge === edge2 || edge === [...edge2].reverse().join('')
          )
      )
  ).length === 2

const stitch = (tiles: TileWithKey[]) => {
  const size = Math.sqrt(tiles.length)
  const getPos = (index: number) => ({
    x: index % size,
    y: Math.floor(index / size)
  })
  const toTransformArray = (tiles: TileWithKey[]) =>
    tiles.flatMap(({ key, tile }) =>
      [...getTransforms(tile)].map((tile) => ({ key, tile }))
    )

  const corner = tiles.find((tile) => isCorner(tiles, tile))!
  for (const start of toTransformArray([corner])) {
    const array = make2dArray<TileWithKey | null>(size, size, null)
    const keys = new Set([start.key])
    array[0][0] = start
    let i = 1

    while (i < tiles.length) {
      const { x, y } = getPos(i)
      const remainingTiles = tiles.filter(({ key }) => !keys.has(key))
      const next = toTransformArray(remainingTiles).find(
        ({ tile }) =>
          (x === 0 || leftMatches(tile, array[y][x - 1]!.tile)) &&
          (y === 0 || topMatches(tile, array[y - 1][x]!.tile))
      )
      if (!next) break
      array[y][x] = next
      keys.add(next.key)
      i++
    }

    if (i >= tiles.length) return array
  }
}

const merge = (tiles: Tile[][]) =>
  tiles
    .flatMap((tileRow, ty) =>
      tileRow[0].map((_, y) =>
        tiles[ty].map((tile) => tile[y].join('')).join('')
      )
    )
    .join('\n')

const findSeaMonsters = (tile: Tile) => {
  const monster = parse2dArray(
    dedent`
      ..................O.
      O....OO....OO....OOO
      .O..O..O..O..O..O...
    `
  )

  for (const t of getTransforms(tile)) {
    let found = false
    for (const [x, y] of nestedLoop(2, 0, [
      t[0].length - monster[0].length - 1,
      t.length - monster.length - 1
    ])) {
      const match = monster.every((line, my) =>
        line.every((c, mx) => c === '.' || t[y + my][x + mx] === '#')
      )
      if (match) {
        found = true
        monster.forEach((line, my) =>
          line.forEach((c, mx) => {
            if (c !== '.') t[y + my][x + mx] = c
          })
        )
      }
    }
    if (found) return t
  }
}

export const Part1 = () => {
  const stitched = stitch(parseInput())!
  const result = [stitched[0], stitched[stitched.length - 1]]
    .flatMap((line) => [line[0]!.key, line[line.length - 1]!.key])
    .reduce(product)
  const merged = merge(stitched.map((tileRow) => tileRow.map((t) => t!.tile)))
  return m(
    'div',
    'The product of the keys in the 4 corners is ',
    m(Answer, result),
    '.',
    m(Visualize, merged)
  )
}

export const Part2 = () => {
  const stitched = stitch(parseInput())!
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
  const outputMap = new Map([
    ['.', m('span' + z`color blue`, '.')],
    ['O', m('strong' + z`color green`, 'O')]
  ])
  return m(
    'div',
    m(Answer, result),
    ' #s are not part of a sea monster.',
    m(
      Visualize,
      [...mapWithMonsters].map((c) => outputMap.get(c) || c)
    )
  )
}
