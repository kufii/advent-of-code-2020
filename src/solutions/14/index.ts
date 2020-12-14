import input from './input'
import { replaceAt, sum } from '/utilities'
import { m } from '/vdom'

interface Command {
  command: string
  arg: string
}

const parseInput = () =>
  input
    .split('\n')
    .map((line) => line.split(' = '))
    .map(([command, arg]) => ({ command, arg }))

const run = (commands: Command[]) => {
  const memory = new Map<number, string>()
  let mask = ''
  for (const { command, arg } of commands) {
    if (command === 'mask') {
      mask = arg
      continue
    }
    const address = Number(command.match(/\d+/u)![0])
    const value = [...Number(arg).toString(2).padStart(36, '0')]
      .map((c, i) => (mask[i] === 'X' ? c : mask[i]))
      .join('')
    memory.set(address, value)
  }
  return [...memory.values()].map((str) => parseInt(str, 2)).reduce(sum)
}

const expandFloats = (str: string): string[] => {
  const floatIndex = str.indexOf('X')
  if (floatIndex < 0) return [str]
  return ['0', '1'].flatMap((replace) =>
    expandFloats(replaceAt(str, floatIndex, replace))
  )
}

const runVersion2 = (commands: Command[]) => {
  const memory = new Map<number, number>()
  let mask = ''
  for (const { command, arg } of commands) {
    if (command === 'mask') {
      mask = arg
      continue
    }
    const address = [
      ...Number(command.match(/\d+/u)![0]).toString(2).padStart(36, '0')
    ]
      .map((c, i) => (mask[i] === '0' ? c : mask[i]))
      .join('')
    expandFloats(address).forEach((str) =>
      memory.set(parseInt(str, 2), Number(arg))
    )
  }
  return [...memory.values()].reduce(sum)
}

export const Part1 = () =>
  m(
    'div',
    'The sum of all memory addresses after running the program is ',
    m('strong', run(parseInput())),
    '.'
  )

export const Part2 = () =>
  m(
    'div',
    'The sum of all memory addresses after running version 2 of the program is ',
    m('strong', runVersion2(parseInput())),
    '.'
  )
