import { Icon } from '/components'
import { Solution } from '/components/Solution'
import { setPart, setShowCode, useStore } from '/store'
import { m, newTab } from '/vdom'
import days, { Solution as SolutionType } from '/solutions'
import { CodeViewer } from '/components/CodeViewer'

interface Props {
  day: number
}

export const ViewDay = ({ day }: Props) => {
  const { part, showCode } = useStore(({ part, showCode }) => ({
    part,
    showCode
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
        solution &&
          m(
            'button.btn.btn-link',
            { onClick: () => setShowCode(!showCode) },
            showCode ? 'Hide Code' : 'Show Code'
          )
      ]),
      !solution && m('p', `Day ${day} not yet implemented.`),
      showCode && m(CodeViewer, { day }),
      solution && part && m(Solution, { solution, part })
    ])
  )
}
