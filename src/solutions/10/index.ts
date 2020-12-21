import input from './input'
import { Answer } from '/components'
import { sortNum, sum } from '/utilities'
import { m } from '/vdom'

const parseInput = () => {
  const nums = input.split('\n').map(Number)
  return [...nums, 0, Math.max(...nums) + 3].sort(sortNum)
}

const getNumArrangements = (adapters: number[]) => {
  const memo: Record<number, number> = {}
  const recursive = (index: number, count = 0): number => {
    if (memo[index]) return count + memo[index]
    if (index >= adapters.length - 1) return count + 1

    memo[index] = adapters
      .slice(index + 1, index + 4)
      .filter((n) => n - adapters[index] <= 3)
      .map((_, i) => recursive(i + index + 1, count))
      .reduce(sum)
    return memo[index]
  }
  return recursive(adapters[0])
}

export const Part1 = () => {
  const adapters = parseInput()
  const withDifferenceOf = (n: number) => (adapter: number, i: number) =>
    i > 0 && adapter - adapters[i - 1] === n
  const [num1Jolt, num3Jolt] = [1, 3].map(
    (n) => adapters.filter(withDifferenceOf(n)).length
  )
  return m(
    'div',
    `There are ${num1Jolt} 1-jolt differences and ${num3Jolt} 3-jolt differences. The result is `,
    m(Answer, num1Jolt * num3Jolt),
    '.'
  )
}

export const Part2 = () =>
  m(
    'div',
    'There are ',
    m(Answer, getNumArrangements(parseInput())),
    ' distinct arrangements of joltage adapters.'
  )
