import { CmpChild } from '/types'
import { m, z } from '/vdom'

interface Props {
  children: CmpChild
}

export const Visualize = ({ children }: Props) =>
  m(
    'pre' +
      z`
        overflow-x scroll
        ff 'SF Mono', Menlo, Inconsolata, monospace
        line-height 1
      `,
    children
  )
