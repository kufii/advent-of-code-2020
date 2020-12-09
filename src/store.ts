import staterino from 'staterino';
import merge from 'mergerino';
import * as hooks from 'preact/hooks';

interface State {
  day: string;
}

const initialState: State = {
  day: '1',
};

export const useStore = staterino({
  merge,
  hooks,
  state: initialState,
});

export const {set, get} = useStore;

export const setDay = (day: string) => set({day});
