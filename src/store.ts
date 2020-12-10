import staterino from 'staterino'
import merge from 'mergerino'
import * as hooks from 'preact/hooks'

type Part = 1 | 2 | null
interface State {
  part: Part
}

const initialState: State = {
  part: null
}

export const useStore = staterino({
  merge,
  hooks,
  state: initialState
})

export const { set, get } = useStore

export const setPart = (part: Part) => set({ part })
