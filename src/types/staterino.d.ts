declare module 'staterino' {
  interface StoreHook<S extends object> {
    <T>(selector: (state: S) => T): T;
    set: (patch: import('mergerino').MultipleTopLevelPatch<S>) => void;
    get: () => S;
  }

  interface Conf<S extends object> {
    merge: import('mergerino').Merge;
    hooks: {useReducer: any; useLayoutEffect: any};
    state: S;
  }

  interface CreateHook {
    <S extends object>(conf: Conf<S>): StoreHook<S>;
  }

  declare const staterino: CreateHook;

  export default staterino;
}
