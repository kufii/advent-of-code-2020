import { useEffect, useState } from 'preact/hooks'
import input from './input'
import { fastMax, fastMin, nestedLoop, parse2dArray } from '/utilities'
import { m } from '/vdom'

interface Coord {
  x: number
  y: number
  z: number
  w: number
}

type Space = Map<string, string>

const key = ({ x, y, z, w }: Coord) => `${x},${y},${z},${w}`

const unKey = (key: string) => {
  const [x, y, z, w] = key.split(',').map(Number)
  return { x, y, z, w }
}

export const parseInput = () => {
  const map = new Map<string, string>()
  const array = parse2dArray(input)
  for (const [y, x] of nestedLoop(2, 0, [
    array.length - 1,
    array[0].length - 1
  ])) {
    map.set(key({ x, y, z: 0, w: 0 }), array[y][x])
  }
  return map
}

const getNeighbors = function* ({ x, y, z, w }: Coord, numAxis = 3) {
  for (const [dx, dy, dz, dw = 0] of nestedLoop(numAxis, -1, 1)) {
    if (!(dx === 0 && dy === 0 && dz === 0 && dw === 0))
      yield { x: x + dx, y: y + dy, z: z + dz, w: w + dw }
  }
}

const getBounds = (
  map: Space
): Record<string, { min: number; max: number }> => {
  const coords = [...map.keys()].map(unKey)
  const attrs: ['x', 'y', 'z', 'w'] = ['x', 'y', 'z', 'w']
  return attrs.reduce((acc, key) => {
    const arr = coords.map((c) => c[key])
    return { ...acc, [key]: { min: fastMin(arr), max: fastMax(arr) } }
  }, {})
}

const updateCoord = (
  oldMap: Space,
  newMap: Space,
  coord: Coord,
  numAxis = 3
) => {
  const numActiveNeighbors = [...getNeighbors(coord, numAxis)].filter(
    (coord) => oldMap.get(key(coord)) === '#'
  ).length
  const cKey = key(coord)
  newMap.set(
    cKey,
    oldMap.get(cKey) === '#'
      ? [2, 3].includes(numActiveNeighbors)
        ? '#'
        : '.'
      : numActiveNeighbors === 3
      ? '#'
      : '.'
  )
}

const tick = function* (map: Space, numAxis = 3) {
  const newMap = new Map<string, string>()
  const bounds = getBounds(map)
  for (const [x, y, z, w = 0] of nestedLoop(
    numAxis,
    [bounds.x.min - 1, bounds.y.min - 1, bounds.z.min - 1, bounds.w.min - 1],
    [bounds.x.max + 1, bounds.y.max + 1, bounds.z.max + 1, bounds.w.max + 1]
  )) {
    updateCoord(map, newMap, { x, y, z, w }, numAxis)
    yield
  }
  yield newMap
}

const getNumActive = (map: Space) =>
  [...map.values()].filter((c) => c === '#').length

const run = function* (map: Space, numAxis = 3, yieldEvery = 0) {
  let n = 0
  for (let i = 0; i < 6; i++) {
    for (const newMap of tick(map, numAxis)) {
      if (newMap) map = newMap
      if (yieldEvery && n++ % yieldEvery === 0) yield
    }
  }
  yield getNumActive(map)
}

export const Part1 = () =>
  m(
    'div',
    'After 6 cycles, there are ',
    m('strong', [...run(parseInput())][0]),
    ' active cubes in the 3-dimensional space.'
  )

export const Part2 = () => {
  const [result, setResult] = useState<number | null>(null)

  useEffect(() => {
    const map = parseInput()
    const gen = run(map, 4, 10000)
    const interval = setInterval(() => {
      const { value, done } = gen.next()
      if (done) clearInterval(interval)
      if (value) setResult(value)
    }, 0)
    return () => clearInterval(interval)
  }, [])

  return m(
    'div',
    result
      ? m(
          'span',
          'After 6 cycles, there are ',
          m('strong', result),
          ' active cubes in the 4-dimensional space.'
        )
      : 'Running...'
  )
}
