import { m, z } from '/vdom'
import { useEffect, useState } from 'preact/hooks'
import { Icon } from './Icon'

interface Item {
  key: string
  text: string
}

interface Props {
  items: Item[]
  selected: string
  onSelect(key: string): void
  textColor?: string
  menuTextColor?: string
}

export const Dropdown = ({
  items,
  selected,
  onSelect,
  textColor = 'primary',
  menuTextColor = 'primary'
}: Props) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleOutsideClick = () => setOpen(false)
    document.body.addEventListener('click', handleOutsideClick)
    return () => document.body.removeEventListener('click', handleOutsideClick)
  })

  const handleSelect = (e: Event, key: string) => {
    e.stopPropagation()
    onSelect(key)
    setOpen(false)
  }

  return m(
    'div.dropdown' + z.concat(open && 'active'),
    { tabindex: 0, 'data-toggle': 'dropdown', role: 'button' },
    [
      m(
        `button.btn.btn-link.dropdown-toggle.text-${textColor}`,
        { onClick: () => setOpen(true) },
        [
          items.find(({ key }) => key === selected)?.text,
          m(Icon, { name: 'caret' })
        ]
      ),
      m(
        `ul.menu.text-${menuTextColor}`,
        items.map(({ key, text }) =>
          m(
            'li.menu-item.text-left',
            m(
              'a.btn.btn-link.text-left',
              { onClick: (e: Event) => handleSelect(e, key) },
              text
            )
          )
        )
      )
    ]
  )
}
