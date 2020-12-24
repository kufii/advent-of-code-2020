import input from './input'
import { Answer } from '/components'
import { nTimes, product, range } from '/utilities'
import { m } from '/vdom'

const parseInput = () => input.split('').map(Number)

class CupList {
  list: Record<number, number> = {}

  constructor(arr: number[]) {
    arr.forEach((c, i) => {
      this.list[c] = arr[(i + 1) % arr.length]
    })
  }

  next(n: number) {
    return this.list[n]
  }

  slice(at: number, length: number) {
    const result: number[] = []
    nTimes(length, () => {
      const next = this.list[at]
      result.push(next)
      at = next
    })
    return result
  }

  splice(at: number, length: number) {
    const removed = this.slice(at, length)
    this.list[at] = this.list[removed[removed.length - 1]]
    return removed
  }

  insert(at: number, arr: number[]) {
    const before = this.list[at]
    arr.forEach((n) => {
      this.list[at] = n
      at = n
    })
    this.list[at] = before
  }
}

const run = (cups: number[], largestCup?: number, times = 100) => {
  const min = Math.min(...cups)
  let max = Math.max(...cups)
  if (largestCup) {
    cups = [...cups, ...range(max + 1, largestCup)]
    max = largestCup
  }

  const list = new CupList(cups)

  let current = cups[0]
  nTimes(times, () => {
    const removed = list.splice(current, 3)

    let dest = current
    do {
      dest--
      if (dest < min) dest = max
    } while (removed.includes(dest))

    list.insert(dest, removed)
    current = list.next(current)
  })

  return list.slice(1, cups.length - 1)
}

export const Part1 = () =>
  m(
    'div',
    'After 100 moves, the cups after cup 1 are ',
    m(Answer, run(parseInput()).join('')),
    '.'
  )

export const Part2 = () => {
  const cups = run(parseInput(), 1000000, 10000000).slice(0, 2)
  return m(
    'div',
    `After 10000000 moves, the 2 cups after cup 1 are ${cups.join(
      ' and '
    )}. The product is `,
    m(Answer, cups.reduce(product)),
    '.'
  )
}
