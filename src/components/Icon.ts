import { m } from '/vdom'

interface Props {
  name: string
}

export const Icon = ({ name }: Props) => m(`i.icon.icon-${name}`)
