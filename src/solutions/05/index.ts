import input from './input'
import { maxBy, sortNum } from '/utilities'
import { m } from '/vdom'

const parseInput = () => input.split('\n')

const findSeat = (
  pass: string,
  minRow = 0,
  maxRow = 127,
  minCol = 0,
  maxCol = 7
) => {
  for (const c of pass) {
    if (c === 'F') maxRow -= Math.ceil((maxRow - minRow) / 2)
    else if (c === 'B') minRow += Math.ceil((maxRow - minRow) / 2)
    else if (c === 'L') maxCol -= Math.ceil((maxCol - minCol) / 2)
    else if (c === 'R') minCol += Math.ceil((maxCol - minCol) / 2)
  }
  return minRow * 8 + minCol
}

const findMissingSeat = (seats: number[]) => {
  seats = seats.sort(sortNum)
  return (
    seats.find((seat, index) => index > 0 && seats[index - 1] !== seat - 1)! - 1
  )
}

export const Part1 = () => {
  const { pass, seatId } = parseInput()
    .map((pass) => ({ pass, seatId: findSeat(pass) }))
    .reduce(maxBy(({ seatId }) => seatId))
  return m(
    'div',
    `The boarding pass ${pass} has the highest seat ID of `,
    m('strong', seatId),
    '.'
  )
}

export const Part2 = () =>
  m(
    'div',
    'The one empty seat is seat ID ',
    m('strong', findMissingSeat(parseInput().map((pass) => findSeat(pass)))),
    '.'
  )
