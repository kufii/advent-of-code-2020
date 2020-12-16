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
        ff source-code-pro, monospace
        line-height 100%
        padding-bottom 10px
        margin-bottom -10px
      `,
    children
  )
