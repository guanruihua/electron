import React from 'react'
import { useSetState } from '0hook'
import type { PageState, UsePageState, Target } from './type'

const getDefault = (): PageState => ({
  search: '',
  setting: {},
  select: [],
  fastStart: [],
  startMenu: [],
})

export const uesPageState = (): UsePageState => {
  const [state, setState] = useSetState<PageState>(getDefault())

  const reload = async () => {
    // const val: ObjectType[] = await window.api.getStartMenu()
    // console.log('🚀 ~ Home ~ val:', val)
    const startMenu_res = await window.api.store({ type: 'get/startMenu' })
    const fastStart_res = await window.api.store({ type: 'get/fastStart' })
    console.log('🚀 ~ reload ~ fastStart_res:', fastStart_res)
    const setting_res = await window.api.store({ type: 'get/setting' })
    // console.log(res)
    setState({
      setting: setting_res.data || {},
      startMenu: startMenu_res.data || [],
      fastStart: fastStart_res.data || [],
    })
  }

  const init = async () => {
    reload()
  }

  React.useEffect(() => {
    init()
  }, [])

  return {
    state,
    setState,
    handle: {
      reload,
      save(target: Target) {
        console.log('🚀 ~ uesPageState ~ target:', target)
        window.api.store(target).then(() => {
          reload()
        })
      },
    },
  }
}
