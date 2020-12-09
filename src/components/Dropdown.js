import { m } from '/vdom'
import { useState } from 'preact/hooks'
import { Icon } from './Icon'

export const Dropdown = ({
  items,
  selected,
  onSelect,
  textColor = 'text-primary',
  menuTextColor = 'textPrimary'
}) => {
  const [open, setOpen] = useState(false)
  return m(
    'div.dropdown',
    { tabindex: 0, 'data-toggle': 'dropdown', role: 'button' },
    [
      m(`a.btn.btn-link.dropdown-toggle.${textColor}`, [
        items.find(({ key }) => key === selected).text,
        m(Icon, { name: 'caret' })
      ]),
      m(
        `ul.menu.${menuTextColor}`,
        items.map(({ key, text }) =>
          m(
            'li.menu-item',
            m('button.btn.btn-link', { onClick: () => onSelect(key) }, text)
          )
        )
      )
    ]
  )
}
