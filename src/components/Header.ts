import { m, z, href, newTab } from '/vdom'
import { Dropdown } from '/components'
import { useStore, setDay, setPart } from '/store'
import { range } from '/utilities'
import { githubIcon } from './images'

console.log(githubIcon)

export const Header = () => {
  const day = useStore(({ day }) => day)
  return m(
    'header.navbar.p-2.bg-primary.text-light' +
      z`box-shadow 0 2px 4px rgba(0, 0, 0, 0.5);`,
    [
      m('section.navbar-section', [
        m(
          'a.navbar-brand.text-bold.mx-2.text-light' + z`white-space nowrap`,
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
      ]),
      m(
        'section.navbar-section',
        m(
          'a.btn.btn-link',
          { href: 'https://github.com/kufii/advent-of-code-2020', ...newTab },
          m('img' + z`height 100%`, { src: githubIcon, alt: 'GitHub' })
        )
      )
    ]
  )
}
