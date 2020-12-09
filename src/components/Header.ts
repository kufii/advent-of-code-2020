import { m } from '/vdom'
import { useState } from 'preact/hooks'
import { Dropdown } from '/components'

export const Header = () => {
  const [day, setDay] = useState('1')
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
