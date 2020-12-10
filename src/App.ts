import { m } from '/vdom'
import { Header } from '/components'
import { useStore, setPart } from '/store'
import days from '/solutions'
import { Solution } from './components/Solution'

export const App = () => {
  const day = useStore(({ day }) => day)
  const part = useStore(({ part }) => part)
  const solution = days[Number(day) - 1]
  return m('div', [
    m(Header),
    m(
      'div.container.mt-2',
      m(
        'div.container',
        m(
          'div.columns',
          m('div.column.col-8.col-md-12.col-mx-auto', [
            m('h1', `Day ${day} Solutions`),
            m('div.mb-2', [
              m('button.btn.mr-1', { onClick: () => setPart(1) }, 'Part 1'),
              m('button.btn', { onClick: () => setPart(2) }, 'Part 2')
            ]),
            part && m(Solution, { solution, part })
          ])
        )
      )
    )
  ])
}
