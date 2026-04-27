import { useSetState } from '0hook'
import { State } from './type'
import { DefaultState } from './conf'
import { useLoadings, useMsg } from '@/util'

export const useHomeView = () => {
  const {context, success, error}= useMsg()
  const [loadings, setLoadings] = useLoadings({
    nodeThread: false,
    stopAll: false,
    findAll: false,
  })

  const [state, _renderState] = useSetState<State>({
    initSuccess: false,
  })


  const setDefaultState = (state: State): state is Required<State> => {
    try {
      if (!state?.setting) state.setting = DefaultState.setting
      if (!state.setting.quickStarts) state.setting.quickStarts = []
      return true
    } catch (error) {
      return false
    }
  }
  const renderState = () => _renderState(state)

  const setState = (newState: Partial<State>) => {
    for (let key in newState) {
      state[key] = newState[key]
    }
  }

  const handle = {
    setLoadings,
    setState,
    renderState,
    
    reload: () => window.location.reload(),
    setDefaultState,
    success,
    error,
  }

  return {
    loadings,
    state,
    handle,
    context,
  }
}
