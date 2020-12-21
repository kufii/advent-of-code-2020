import { m } from '/vdom'

interface Props {
  children: string
}

export const Icon = ({ children }: Props) => m(`i.icon.icon-${children}`)
