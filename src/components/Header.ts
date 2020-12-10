import { m, z, newTab } from '/vdom'
import { Dropdown } from '/components'
import { setPart, setShowCode } from '/store'
import { range } from '/utilities'
import { githubIcon } from './images'
import { route } from 'preact-router'

interface Props {
  day: string
}

export const Header = ({ day }: Props) =>
  m(
    'header.navbar.p-2.bg-primary.text-light.p-sticky' +
      z`
        box-shadow 0 2px 4px rgba(0, 0, 0, 0.5)
        top 0
        z-index 1000
      `,
    [
      m('section.navbar-section', [
        m(
          'a.navbar-brand.text-bold.mx-2.text-light' +
            z`white-space nowrap; font-family monospace`,
          { href: '/' },
          'Advent of Code 2020'
        ),
        m(Dropdown, {
          selected: day,
          onSelect: (day) => {
            setPart(null)
            setShowCode(false)
            route('/' + day)
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
          'a.btn.btn-link.mx-2.p-0',
          { href: 'https://github.com/kufii/advent-of-code-2020', ...newTab },
          m('img' + z`height 100%`, { src: githubIcon, alt: 'GitHub' })
        )
      )
    ]
  )
