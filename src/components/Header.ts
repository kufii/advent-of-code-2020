import { m } from '/vdom'
import { Dropdown } from '/components'
import { useStore, setDay } from '/store'

export const Header = () => {
  const day = useStore(({ day }) => day);
  return m(
    'header.navbar.p-2.bg-primary.text-light',
    m('section.navbar-section', [
      m(
        'a.navbar-brand.text-bold.mx-2.text-light',
        { href: '/' },
        'Advent of Code 2020'
      ),
      m(Dropdown, {
        selected: day,
        onSelect: (day) => setDay(day),
        items: [
          { key: '1', text: 'Day 1' },
          { key: '2', text: 'Day 2' },
          { key: '3', text: 'Day 3' }
        ],
        textColor: 'light'
      })
    ])
  )
}
