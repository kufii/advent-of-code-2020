import input from './input'
import { Answer } from '/components'
import { fastMax, fastMin, nestedLoop, nTimes } from '/utilities'
import { m } from '/vdom'

interface Pos {
  x: number
  y: number
}

const key = ({ x, y }: { x: number; y: number }) => `${x},${y}`

const unKey = (key: string) => {
  const [x, y] = key.split(',').map(Number)
  return { x, y }
}

const parseInput = (): string[][] =>
  input.split('\n').map((line) => line.match(/(se|sw|ne|nw|e|w)/gu)!)

const getCoord = (direction: string[]) =>
  direction.reduce(
    (pos, d) => {
      if (d === 'w') {
        pos.x--
      } else if (d === 'e') {
        pos.x++
      } else if (d.startsWith('n')) {
        pos.y--
        if (d === 'ne') pos.x++
      } else if (d.startsWith('s')) {
        pos.y++
        if (d === 'sw') pos.x--
      }
      return pos
    },
    { x: 0, y: 0 }
  )

const getCoords = (directions: string[][]) =>
  directions
    .map(getCoord)
    .map(key)
    .reduce(
      (acc, pos) => acc.set(pos, !acc.get(pos)),
      new Map<string, boolean>()
    )

const getNeighbors = ({ x, y }: Pos) =>
  [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1]
  ].map(([dx, dy]) => ({ x: x + dx, y: y + dy }))

const tick = (coords: Map<string, boolean>) => {
  const black = [...coords.entries()]
    .filter(([, value]) => value)
    .map(([key]) => unKey(key))
  const axis: ['x', 'y'] = ['x', 'y']
  const [minX, maxX, minY, maxY] = axis
    .map((prop) => black.map((c) => c[prop]))
    .flatMap((arr) => [fastMin(arr) - 1, fastMax(arr) + 1])

  const newMap = new Map<string, boolean>()
  for (const [x, y] of nestedLoop(2, [minX, minY], [maxX, maxY])) {
    const pos = { x, y }
    const state = coords.get(key(pos))
    const numBlack = getNeighbors(pos).filter((pos) => coords.get(key(pos)))
      .length
    newMap.set(
      key(pos),
      state ? !(numBlack === 0 || numBlack > 2) : numBlack === 2
    )
  }
  return newMap
}

const getNumBlack = (coords: Map<string, boolean>) =>
  [...coords.values()].filter(Boolean).length

export const Part1 = () =>
  m(
    'div',
    'After following the instructions, ',
    m(Answer, getNumBlack(getCoords(parseInput()))),
    ' tiles are flipped to the black side.'
  )

export const Part2 = () => {
  let coords = getCoords(parseInput())
  nTimes(100, () => (coords = tick(coords)))
  return m(
    'div',
    'After 100 days, ',
    m(Answer, getNumBlack(coords)),
    ' tiles are flipped to the black side.'
  )
}
