import staterino from 'staterino'
import merge from 'mergerino'
import * as hooks from 'preact/hooks'

type Part = 1 | 2 | null
interface State {
  part: Part
  showCode: boolean
}

const initialState: State = {
  part: null,
  showCode: false
}

export const useStore = staterino({
  merge,
  hooks,
  state: initialState
})

export const { set, get } = useStore

export const resetStore = () => set(initialState)

export const setPart = (part: Part) => set({ part })

export const setShowCode = (showCode: boolean) => set({ showCode })
