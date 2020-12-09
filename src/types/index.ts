import { VNode } from 'preact'

export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> }

export type CmpChild = VNode<any> | string | number | boolean | null | undefined | CmpChild[]
