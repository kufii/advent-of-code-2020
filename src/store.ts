import staterino from 'staterino'
import merge from 'mergerino'
import * as hooks from 'preact/hooks'

type Part = 1 | 2 | null
interface State {
  day: string
  part: Part
}

const initialState: State = {
  day: '1',
  part: null
}

export const useStore = staterino({
  merge,
  hooks,
  state: initialState
})

export const { set, get } = useStore

export const setDay = (day: string) => set({ day })

export const setPart = (part: Part) => set({ part })
