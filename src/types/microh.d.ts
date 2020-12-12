declare module 'microh' {
  type AnyFn = (...args: any[]) => unknown

  type Child<H extends AnyFn> =
    | number
    | string
    | boolean
    | undefined
    | null
    | boolean
    | string
    | Child<H>[]
    | ReturnType<H>

  type VnodeFn<H extends AnyFn> = {
    (tag: string, ...children: Child<H>[]): ReturnType<H>
    (
      tag: string,
      props: Record<string, unknown>,
      ...children: Child<H>[]
    ): ReturnType<H>
    <P>(
      tag: import('preact').ComponentType<P>,
      props: Omit<P, 'children'>,
      ...children: Child<H>[]
    ): ReturnType<H>
    <P>(
      tag: import('preact').ComponentType<P>,
      props: P,
      ...children: Child<H>[]
    ): ReturnType<H>
    <P>(
      tag: import('preact').ComponentType<P>,
      ...children: Child<H>[]
    ): ReturnType<H>
  }

  const microh: <H extends AnyFn>(transform: H) => VnodeFn<H>

  export default microh
}
