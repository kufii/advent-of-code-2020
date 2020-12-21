import input from './input'
import { Answer } from '/components'
import { nestedLoop, sum } from '/utilities'
import { m } from '/vdom'

const parseInput = () => input.split('\n').map(Number)

const findBrokenNum = (nums: number[], numBefore = 25) =>
  nums.slice(numBefore).find((n, i) => {
    for (const [n1, n2] of nestedLoop(2, i, i + numBefore - 1)) {
      if (nums[n1] + nums[n2] === n) return false
    }
    return true
  })

const findSetThatSums = (nums: number[], expectedSum: number) => {
  for (let start = 0; start < nums.length; start++) {
    const set = []
    for (let i = start; i < nums.length; i++) {
      set.push(nums[i])
      if (set.length < 2) continue
      const total = set.reduce(sum)
      if (total === expectedSum) return set
      else if (total > expectedSum) break
    }
  }
}

export const Part1 = () =>
  m(
    'div',
    "The first number that isn't the sum of 2 of the previous 25 numbers is ",
    m(Answer, findBrokenNum(parseInput())),
    `.`
  )

export const Part2 = () => {
  const nums = parseInput()
  const broken = findBrokenNum(nums)!
  const set = findSetThatSums(nums, broken)!
  const result = Math.min(...set) + Math.max(...set)
  return m(
    'div',
    `The set [${set.join(', ')}] sums ${broken}. The encryption weakness is `,
    m(Answer, result),
    `.`
  )
}
