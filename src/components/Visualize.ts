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
        ff 'Source Code Pro', monospace
        line-height 100%
      `,
    children
  )
