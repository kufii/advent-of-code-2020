import input from './input'
import { Answer } from '/components'
import { sortNumDesc, sum } from '/utilities'
import { m } from '/vdom'

const parseInput = () =>
  input.split('\n\n').map((block) => block.split('\n').slice(1).map(Number))

const calculatePoints = (hand: number[]) =>
  hand
    .reverse()
    .map((c, i) => c * (i + 1))
    .reduce(sum)

const getWinner = (hand1: number[], hand2: number[]): [1 | 2, number] =>
  hand1.length ? [1, calculatePoints(hand1)] : [2, calculatePoints(hand2)]

const play = (hand1: number[], hand2: number[]) => {
  while (hand1.length && hand2.length) {
    const [card1, card2] = [hand1.shift()!, hand2.shift()!]
    const winnerHand = card1 > card2 ? hand1 : hand2
    winnerHand.push(...[card1, card2].sort(sortNumDesc))
  }
  return getWinner(hand1, hand2)
}

const playRecursive = (hand1: number[], hand2: number[]): [1 | 2, number] => {
  const playHistory = new Set<string>()
  const key = () => hand1.join(',') + '&' + hand2.join(',')

  while (hand1.length && hand2.length) {
    if (playHistory.has(key())) return [1, calculatePoints(hand1)]
    playHistory.add(key())

    const [card1, card2] = [hand1.shift()!, hand2.shift()!]
    const winner =
      hand1.length >= card1 && hand2.length >= card2
        ? playRecursive(hand1.slice(0, card1), hand2.slice(0, card2))[0]
        : card1 > card2
        ? 1
        : 2
    const [winnerHand, wonCards] =
      winner === 1 ? [hand1, [card1, card2]] : [hand2, [card2, card1]]
    winnerHand.push(...wonCards)
  }
  return getWinner(hand1, hand2)
}

export const Part1 = () => {
  const [hand1, hand2] = parseInput()
  const [winner, score] = play(hand1, hand2)
  return m(
    'div',
    `Player ${winner} wins combat with a score of `,
    m(Answer, score),
    '.'
  )
}

export const Part2 = () => {
  const [hand1, hand2] = parseInput()
  const [winner, score] = playRecursive(hand1, hand2)
  return m(
    'div',
    `Player ${winner} wins recursive combat with a score of `,
    m(Answer, score),
    '.'
  )
}
