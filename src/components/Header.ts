import { m, z, href } from '/vdom'
import { Dropdown } from '/components'
import { useStore, setDay, setPart } from '/store'
import { range } from '/utilities'

export const Header = () => {
  const day = useStore(({ day }) => day)
  return m(
    'header.navbar.p-2.bg-primary.text-light' +
      z`box-shadow 0 2px 4px rgba(0, 0, 0, 0.5);`,
    m('section.navbar-section', [
      m(
        'a.navbar-brand.text-bold.mx-2.text-light',
        { href: href('/') },
        'Advent of Code 2020'
      ),
      m(Dropdown, {
        selected: day,
        onSelect: (day) => {
          setPart(null)
          setDay(day)
        },
        items: range(1, 25).map((n) => ({
          key: n.toString(),
          text: `Day ${n}`
        })),
        textColor: 'light'
      })
    ])
  )
}
