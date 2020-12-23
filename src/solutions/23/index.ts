import input from './input'
import { Answer } from '/components'
import { mod, nTimes, product, range } from '/utilities'
import { m } from '/vdom'

const parseInput = () => input.split('').map(Number)

class CupList {
  list: Record<number, { next: number; prev: number }> = {}

  constructor(arr: number[]) {
    arr.forEach((c, i) => {
      this.list[c] = {
        next: arr[mod(i + 1, arr.length)],
        prev: arr[mod(i - 1, arr.length)]
      }
    })
  }

  get(n: number) {
    return this.list[n]
  }

  splice(at: number, length: number) {
    const result: number[] = []
    nTimes(length, () => {
      const next = this.list[at].next
      result.push(next)
      at = next
    })
    const prev = this.list[result[0]].prev
    const next = this.list[result[length - 1]].next
    this.list[prev].next = next
    this.list[next].prev = prev
    return result
  }

  insert(at: number, arr: number[]) {
    const next = this.list[at].next
    arr.forEach((n) => {
      this.list[at].next = n
      this.list[n].prev = at
      this.list[n].next = next
      this.list[next].prev = n
      at = n
    })
  }

  toArray() {
    const result: number[] = []
    let current = 1
    do {
      result.push(current)
      current = this.list[current].next
    } while (current !== 1)
    return result
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
    current = list.get(current).next
  })

  return list.toArray()
}

export const Part1 = () =>
  m(
    'div',
    'After 100 moves, the cups after cup 1 are ',
    m(Answer, run(parseInput()).slice(1).join('')),
    '.'
  )

export const Part2 = () => {
  const cups = run(parseInput(), 1000000, 10000000).slice(1, 3)
  return m(
    'div',
    `After 10000000 moves, the 2 cups after cup 1 are ${cups.join(
      ' and '
    )}. The product is `,
    m(Answer, cups.reduce(product)),
    '.'
  )
}
