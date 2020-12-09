declare module 'staterino' {
  interface StoreHook<S extends Record<string, unknown>> {
    <T>(selector: (state: S) => T): T;
    set: (patch: import('mergerino').MultipleTopLevelPatch<S>) => void;
    get: () => S;
  }

  interface Conf<S extends Record<string, unknown>> {
    merge: import('mergerino').Merge<S>;
    hooks: {useReducer: any; useLayoutEffect: any};
    state: S;
  }

  interface CreateHook {
    <S extends Record<string, unknown>>(conf: Conf<S>): StoreHook<S>;
  }

  const staterino: CreateHook;

  export default staterino;
}
