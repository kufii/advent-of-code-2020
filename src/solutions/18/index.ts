import input from './input'
import { Answer } from '/components'
import { sum } from '/utilities'
import { m } from '/vdom'

const parseInput = () => input.split('\n')

const evaluate = (str: string) => {
  let result = 0
  let op = '+'
  for (const token of str.split(' ')) {
    if (isNaN(token as any)) op = token
    else {
      const num = Number(token)
      if (op === '+') result += num
      else if (op === '*') result *= num
    }
  }
  return result
}

const orderOfOperations = (str: string) => {
  while (str.includes('+')) {
    str = str.replace(/\d+ \+ \d+/gu, (match) => evaluate(match).toString())
  }
  return evaluate(str)
}

const run = (str: string, doOrderOfOperations = false) => {
  const replaceFunc = doOrderOfOperations ? orderOfOperations : evaluate
  while (str.includes('(')) {
    str = str.replace(/\(([^()]*)\)/gu, (_, group: string) =>
      replaceFunc(group).toString()
    )
  }
  return replaceFunc(str)
}

export const Part1 = () =>
  m(
    'div',
    'The sum of all the homework problems is ',
    m(
      Answer,
      parseInput()
        .map((str) => run(str))
        .reduce(sum)
    ),
    '.'
  )

export const Part2 = () =>
  m(
    'div',
    'The sum of all the homework problems with order of operations is ',
    m(
      Answer,
      parseInput()
        .map((str) => run(str, true))
        .reduce(sum)
    ),
    '.'
  )
