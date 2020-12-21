import { Icon } from './Icon'
import { m, z } from '/vdom'

interface Props {
  children: string
}

export const Answer = ({ children }: Props) =>
  m(
    'span',
    m('strong', children),
    m(
      'button.btn.btn-link.m-0.p-0.ml-1' + z`height inherit`,
      { onClick: () => navigator.clipboard.writeText(children) },
      m(Icon, 'copy')
    )
  )
