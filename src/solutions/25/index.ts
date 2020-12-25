import input from './input'
import { Answer } from '/components'
import { nTimes } from '/utilities'
import { m } from '/vdom'

const parseInput = () => input.split('\n').map(Number)

const tick = (value: number, subject: number) => (value * subject) % 20201227

const run = (subject: number, loop: number) => {
  let value = 1
  nTimes(loop, () => (value = tick(value, subject)))
  return value
}

const getLoopNum = (publicKey: number) => {
  let value = 1
  for (let n = 1; n < Infinity; n++) {
    value = tick(value, 7)
    if (value === publicKey) return n
  }
}

export const Part1 = () => {
  const [card, door] = parseInput()
  const cardLoop = getLoopNum(door)!
  const encryptionKey = run(card, cardLoop)
  return m('div', 'The encryption key is ', m(Answer, encryptionKey), '.')
}
