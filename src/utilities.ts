export const nonNullable = <T>(value: T): value is NonNullable<T> =>
  value !== null && value !== undefined

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

export const truthy = <T>(value: T): value is Truthy<T> => Boolean(value)

export const range = (start: number, end: number) => {
  const arr = []
  for (let n = start; n <= end; n++) {
    arr.push(n)
  }
  return arr
}

export const sum = (a: number, b: number) => a + b

export const nestedLoop = function* (
  n: number,
  start: number,
  end: number
): IterableIterator<number[]> {
  const arr = Array(n).fill(start)
  let i = 0
  while (true) {
    yield arr.slice()
    arr[0]++
    while (arr[i] === end + 1) {
      arr[i] = start
      i++
      if (i === n) return
      arr[i]++
      if (arr[i] !== end + 1) i = 0
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
