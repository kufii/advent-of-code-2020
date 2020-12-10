import { m } from '/vdom'
import input from './input'
import { nestedLoop, sum } from '/utilities'

const parseInput = () => input.split('\n').map(Number)

const findNumbersThatSum = (
  nums: number[],
  expectedSum: number,
  howMany = 2
) => {
  for (const indexes of nestedLoop(howMany, 0, nums.length - 1)) {
    const set = indexes.map((i) => nums[i])
    if (set.reduce(sum) === expectedSum) return set
  }
}

export const Part1 = () => {
  const [n1, n2] = findNumbersThatSum(parseInput(), 2020)!
  return m(
    'div',
    `Numbers ${n1} and ${n2} sum to 2020. Result is `,
    m('strong', n1 * n2),
    '.'
  )
}

export const Part2 = () => {
  const [n1, n2, n3] = findNumbersThatSum(parseInput(), 2020, 3)!
  return m(
    'div',
    `Numbers ${n1}, ${n2}, and ${n3} sum to 2020. Result is `,
    m('strong', n1 * n2 * n3),
    '.'
  )
}
