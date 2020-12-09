/* eslint-disable @typescript-eslint/ban-types */
declare module 'staterino' {
  interface StoreHook<S extends object> {
    <T>(selector: (state: S) => T): T
    set: (patch: import('mergerino').MultipleTopLevelPatch<S>) => void
    get: () => S
  }

  interface Conf<S extends object> {
    merge: import('mergerino').Merge<S>
    hooks: { useReducer: any; useLayoutEffect: any }
    state: S
  }

  interface CreateHook {
    <S extends object>(conf: Conf<S>): StoreHook<S>
  }

  const staterino: CreateHook

  export default staterino
}

declare module 'zaftig'
