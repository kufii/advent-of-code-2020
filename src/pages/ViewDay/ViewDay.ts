import { Icon } from '/components'
import { Solution } from '/components/Solution'
import { setPart, useStore } from '/store'
import { m, newTab } from '/vdom'
import days from '/solutions'

interface Props {
  day: number
}

export const ViewDay = ({ day }: Props) => {
  const part = useStore(({ part }) => part)
  const solution = days[day - 1]
  return m(
    'div.columns',
    m('div.column.col-8.col-md-12.col-mx-auto', [
      m(
        'h1',
        `Day ${day} Solutions `,
        m(
          'a',
          { href: 'https://adventofcode.com/2020/day/' + day, ...newTab },
          m(Icon, { name: 'link' })
        )
      ),
      m('div.mb-2', [
        m('button.btn.mr-1', { onClick: () => setPart(1) }, 'Part 1'),
        m('button.btn', { onClick: () => setPart(2) }, 'Part 2')
      ]),
      part && m(Solution, { solution, part })
    ])
  )
}
