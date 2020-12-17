import { useEffect, useState } from 'preact/hooks'
import input from './input'
import { nestedLoop, nTimes, parse2dArray } from '/utilities'
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
  for (let y = 0; y < array.length; y++) {
    for (let x = 0; x < array.length; x++) {
      map.set(key({ x, y, z: 0, w: 0 }), array[y][x])
    }
  }
  return map
}

const getValue = (map: Space, coord: Coord) => map.get(key(coord)) || '.'

const getNeighbors = function* ({ x, y, z, w }: Coord, numAxis = 3) {
  for (const [dx, dy, dz, dw = 0] of nestedLoop(numAxis, -1, 1)) {
    if (!(dx === 0 && dy === 0 && dz === 0 && dw === 0))
      yield { x: x + dx, y: y + dy, z: z + dz, w: w + dw }
  }
}

const getBounds = (map: Space) => {
  const coords = [...map.keys()].map(unKey)
  return {
    x: {
      min: Math.min(...coords.map(({ x }) => x)),
      max: Math.max(...coords.map(({ x }) => x))
    },
    y: {
      min: Math.min(...coords.map(({ y }) => y)),
      max: Math.max(...coords.map(({ y }) => y))
    },
    z: {
      min: Math.min(...coords.map(({ z }) => z)),
      max: Math.max(...coords.map(({ z }) => z))
    },
    w: {
      min: Math.min(...coords.map(({ w }) => w)),
      max: Math.max(...coords.map(({ w }) => w))
    }
  }
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
  newMap.set(
    key(coord),
    getValue(oldMap, coord) === '#'
      ? [2, 3].includes(numActiveNeighbors)
        ? '#'
        : '.'
      : numActiveNeighbors === 3
      ? '#'
      : '.'
  )
}

const tick = (map: Space) => {
  const newMap = new Map<string, string>()
  const bounds = getBounds(map)
  for (let x = bounds.x.min - 1; x <= bounds.x.max + 1; x++) {
    for (let y = bounds.y.min - 1; y <= bounds.y.max + 1; y++) {
      for (let z = bounds.z.min - 1; z <= bounds.z.max + 1; z++) {
        updateCoord(map, newMap, { x, y, z, w: 0 })
      }
    }
  }
  return newMap
}

const tickW = (map: Space) => {
  const newMap = new Map<string, string>()
  const bounds = getBounds(map)
  for (let x = bounds.x.min - 1; x <= bounds.x.max + 1; x++) {
    for (let y = bounds.y.min - 1; y <= bounds.y.max + 1; y++) {
      for (let z = bounds.z.min - 1; z <= bounds.z.max + 1; z++) {
        for (let w = bounds.w.min - 1; w <= bounds.w.max + 1; w++) {
          updateCoord(map, newMap, { x, y, z, w }, 4)
        }
      }
    }
  }
  return newMap
}

const getNumActive = (map: Space) =>
  [...map.values()].filter((c) => c === '#').length

export const Part1 = () => {
  let map = parseInput()
  nTimes(6, () => (map = tick(map)))
  return m(
    'div',
    'After 6 cycles, there are ',
    m('strong', getNumActive(map)),
    ' active cubes in the 3-dimensional space.'
  )
}

export const Part2 = () => {
  const [result, setResult] = useState<number | null>(null)

  useEffect(() => {
    let map = parseInput()
    nTimes(6, () => (map = tickW(map)))
    setResult(getNumActive(map))
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
