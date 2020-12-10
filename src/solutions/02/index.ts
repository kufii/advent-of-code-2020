import input from './input'
import { m } from '/vdom'

interface Pass {
  min: number
  max: number
  char: string
  pass: string
}

const parseInput = () =>
  input
    .split('\n')
    .map(
      (line) =>
        line.match(/(?<min>\d+)-(?<max>\d+) (?<char>[a-z]): (?<pass>[a-z]+)/u)!
          .groups!
    )
    .map(({ min, max, char, pass }) => ({
      min: Number(min),
      max: Number(max),
      char,
      pass
    }))

const isValidPass = ({ min, max, char, pass }: Pass) => {
  const count = pass.match(new RegExp(char, 'gu'))?.length || 0
  return count >= min && count <= max
}

const isValidPass2 = ({ min: pos1, max: pos2, char, pass }: Pass) => {
  const [char1, char2] = [pos1, pos2].map((i) => pass[i - 1])
  return +(char1 === char) ^ +(char2 === char)
}

export const Part1 = () =>
  m(
    'div',
    'There are ',
    m('strong', parseInput().filter(isValidPass).length),
    ' valid passwords.'
  )

export const Part2 = () =>
  m(
    'div',
    'There are ',
    m('strong', parseInput().filter(isValidPass2).length),
    ' valid passwords using the 2nd validation method.'
  )
