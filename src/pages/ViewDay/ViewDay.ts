import { Icon, Solution, CodeViewer } from '/components'
import { setPart, useStore } from '/store'
import { m, newTab } from '/vdom'
import days, { Solution as SolutionType } from '/solutions'

interface Props {
  day: number
}

export const ViewDay = ({ day }: Props) => {
  const { part } = useStore(({ part }) => ({
    part
  }))
  const solution = days[day - 1] as SolutionType | undefined
  return m(
    'div.columns',
    m('div.column.col-8.col-lg-12.col-mx-auto', [
      m(
        'h1',
        `Day ${day} Solutions `,
        m(
          'a',
          { href: 'https://adventofcode.com/2020/day/' + day, ...newTab },
          m(Icon, { name: 'link' })
        )
      ),
      m('div', [
        solution?.Part1 &&
          m('button.btn.mr-1', { onClick: () => setPart(1) }, 'Part 1'),
        solution?.Part2 &&
          m('button.btn.mr-1', { onClick: () => setPart(2) }, 'Part 2'),
        solution && m(CodeViewer, { day })
      ]),
      !solution && m('p', `Day ${day} not yet implemented.`),
      solution && part && m(Solution, { solution, part })
    ])
  )
}
