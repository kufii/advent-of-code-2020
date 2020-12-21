import input from './input'
import { Answer } from '/components'
import { m } from '/vdom'

const parseInput = () => {
  const [rules, strings] = input.split('\n\n')
  return {
    rules: rules
      .split('\n')
      .map((line) => line.match(/(?<key>\d+): (?<rule>.+)/u)!.groups!)
      .reduce((acc, { key, rule }) => ({ ...acc, [Number(key)]: rule }), {}),
    strings: strings.split('\n')
  }
}

const isMatch = (
  rules: Record<number, string>,
  rule: number,
  str: string
): boolean => {
  const getPotentialIndexes = (key: number, index = 0): number[] => {
    const rule = rules[key]
    const match = rule.match(/"(?<letter>[a-z])"/u)?.groups?.letter
    if (match) return str[index] === match ? [index + 1] : []
    return rule.split('|').flatMap((keys) => {
      let indexes = [index]
      for (const key of keys.trim().split(' ').map(Number)) {
        indexes = indexes.flatMap((i) => getPotentialIndexes(key, i))
      }
      return indexes
    })
  }
  return getPotentialIndexes(rule).includes(str.length)
}

const getNumMatches = (
  rules: Record<number, string>,
  strings: string[],
  rule: number
) => strings.filter((str) => isMatch(rules, rule, str)).length

export const Part1 = () => {
  const { rules, strings } = parseInput()
  return m(
    'div',
    m(Answer, getNumMatches(rules, strings, 0)),
    ' messages match rule 0.'
  )
}

export const Part2 = () => {
  const { rules, strings } = parseInput()
  rules[8] = '42 | 42 8'
  rules[11] = '42 31 | 42 11 31'
  return m(
    'div',
    'After updating rules 8 and 11, ',
    m(Answer, getNumMatches(rules, strings, 0)),
    ' messages match rule 0.'
  )
}
