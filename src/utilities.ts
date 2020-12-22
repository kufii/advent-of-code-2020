export const nonNullable = <T>(value: T): value is NonNullable<T> =>
  value != null

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

export const truthy = <T>(value: T): value is Truthy<T> => Boolean(value)

export interface Point {
  x: number
  y: number
}

export const range = (start: number, end: number) => {
  const arr = []
  for (let n = start; n <= end; n++) {
    arr.push(n)
  }
  return arr
}

export const sum = (a: number, b: number) => a + b

export const product = (a: number, b: number) => a * b

export const nestedLoop = function* (
  n: number,
  start: number | number[],
  end: number | number[]
): IterableIterator<number[]> {
  const get = (value: number | number[], index: number) =>
    Array.isArray(value) ? value[index] : value
  const arr = Array(n)
    .fill(null)
    .map((_, i) => get(start, i))
  let i = 0
  while (true) {
    yield arr.slice()
    arr[0]++
    while (arr[i] === get(end, i) + 1) {
      arr[i] = get(start, i)
      i++
      if (i === n) return
      arr[i]++
      if (arr[i] !== get(end, i) + 1) i = 0
    }
  }
}

export const parse2dArray = (str: string) =>
  str.split('\n').map((line) => [...line])

export const output2dArray = (arr: string[][]) =>
  arr.map((line) => line.join('')).join('\n')

export const maxBy = <T>(cb: (item: T) => number) => (a: T, b: T) =>
  cb(b) > cb(a) ? b : a

export const minBy = <T>(cb: (item: T) => number) => (a: T, b: T) =>
  cb(b) < cb(a) ? b : a

export const sortNum = (a: number, b: number) => a - b

export const sortNumDesc = (a: number, b: number) => b - a

export const mod = (n: number, mod: number) => ((n % mod) + mod) % mod

export const degToRad = (degrees: number) => (Math.PI / 180) * degrees

export const rotate = (
  { x, y }: Point,
  degrees: number,
  origin: Point = { x: 0, y: 0 }
) => {
  const radians = degToRad(degrees)
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const { x: cx, y: cy } = origin
  return {
    x: cos * (x - cx) + sin * (y - cy) + cx,
    y: cos * (y - cy) - sin * (x - cx) + cy
  }
}

export const manhattanDistance = (a: Point, b: Point = { x: 0, y: 0 }) =>
  Math.abs(b.x - a.x) + Math.abs(b.y - a.y)

export const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)

export const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

export const replaceAt = (str: string, index: number, replace: string) =>
  str.slice(0, index) + replace + str.slice(index + 1)

export const nTimes = (n: number, cb: () => unknown) => {
  for (let i = 0; i < n; i++) cb()
}

export const fastMax = (arr: number[]) =>
  arr.reduce((max, v) => (max >= v ? max : v), -Infinity)

export const fastMin = (arr: number[]) =>
  arr.reduce((min, v) => (min <= v ? min : v), Infinity)

export const make2dArray = <T>(ySize: number, xSize: number, fill: T): T[][] =>
  Array(ySize)
    .fill(null)
    .map(() => Array(xSize).fill(fill))

export const clone2dArray = <T>(array: T[][]) =>
  array.slice().map((line) => line.slice())
