import input from './input'
import { m } from '/vdom'

interface Command {
  op: string
  arg: number
}

const parseInput = (): Command[] =>
  input
    .split('\n')
    .map((line) => line.split(' '))
    .map(([op, arg]) => ({ op, arg: Number(arg) }))

const runProgram = function* (program: Command[]) {
  let result = 0
  let index = 0
  while (index < program.length) {
    const { op, arg } = program[index]
    yield { index, result }
    if (op === 'acc') result += arg
    index += op === 'jmp' ? arg : 1
  }
  yield { index, result }
}

const getValueBeforeLoop = (program: Command[]) => {
  const commandsRun = new Set<number>()
  for (const { index, result } of runProgram(program)) {
    if (commandsRun.has(index)) return result
    commandsRun.add(index)
  }
}

const findExpectedResult = (program: Command[]) => {
  for (let i = 0; i < program.length; i++) {
    if (program[i].op === 'nop') continue
    const newProgram = program.map((a) => ({ ...a }))
    newProgram[i].op = 'nop'
    if (getValueBeforeLoop(newProgram) == null) {
      const result = [...runProgram(newProgram)]
      return result[result.length - 1].result
    }
  }
}

export const Part1 = () =>
  m(
    'div',
    'The accumulator value is ',
    m('strong', getValueBeforeLoop(parseInput())),
    ' before the program infinite loops.'
  )

export const Part2 = () =>
  m(
    'div',
    'The final value after fixing the program is ',
    m('strong', findExpectedResult(parseInput())),
    '.'
  )
