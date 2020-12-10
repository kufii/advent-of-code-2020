import { FunctionComponent } from 'preact'
import { m } from '/vdom'

interface Solution {
  Part1?: FunctionComponent
  Part2?: FunctionComponent
}

interface Props {
  part: 1 | 2
  solution?: Solution
}

export const Solution = ({ part, solution }: Props) => {
  const solutionPart = part === 1 ? solution?.Part1 : solution?.Part2
  return m('div.card.mt-2', [
    m('div.card-header', m('div.card-title.h5', `Part ${part}`)),
    m(
      'div.card-body',
      solutionPart ? m(solutionPart) : m('div', 'Solution not yet implemented')
    )
  ])
}
