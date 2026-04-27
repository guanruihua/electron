import React from 'react'
import { useSetState } from '0hook'
import { State } from '@/type'

const tabs = [
  {
    id: '01',
    title: 'Dashboard',
    type: 'dashboard',
  },
  {
    id: '02',
    title: 'File Resource',
    type: 'fsm',
    url: 'D:\\',
  },
  {
    id: '03',
    title: 'Task Resource',
    type: 'trm',
  },
  {
    id: '04',
    title: 'Clipboard',
    type: 'clipboard',
  },
  {
    id: '99',
    title: 'Other',
    type: 'other',
  },
  {
    id: '100',
    title: 'Setting',
    type: 'setting',
  },
  // {
  //   id: '03',
  //   title: 'Terminal',
  //   type: 'terminal',
  // },
  // {
  //   id: '04',
  //   title: 'Agent',
  //   type: 'agent',
  // },
]

export const usePageState = () => {
  const [state, _renderState] = useSetState<State>({
    activeTab: '01',
  })
  const renderState = () => _renderState(state)

  const setState = (newState: Partial<State>) => {
    for (let key in newState) {
      state[key] = newState[key]
    }
  }

  // const getID = () => Date.now().toString()
  // const cache = React.useRef<any>(null)

  const handle = {
    setState,
    renderState,
    // updateTabInfo(tab) {
    //   const newInfo = info || {}
    //   newInfo[tab.id] = { ...newInfo[tab.id], ...tab }
    //   cache.current = newInfo
    //   setInfo(cache.current)
    // },
    // updateTab(tab) {
    //   const newInfo = info || {}
    //   newInfo[tab.id] = { ...newInfo[tab.id], ...tab }
    //   setInfo(newInfo)
    // },
    // closeTab(id) {
    //   if (!state.tabs) state.tabs = []
    //   const newTabs = state.tabs.filter((_) => _ !== id) || []
    //   delete info[id]
    //   setInfo(info)
    //   setState({
    //     tabs: newTabs,
    //     activeTab: newTabs?.at(-1) || '',
    //   })
    // },
    // addTab(item?: any) {
    //   if (item) {
    //     const { id = getID() } = item
    //     state.activeTab = id
    //     if (!state.tabs) state.tabs = [id]
    //     else state.tabs.push(id)
    //     info[id] = {
    //       id,
    //       ...item,
    //     }
    //     setInfo(info)
    //     setState(state)
    //     return
    //   }
    //   const newTab = getID()
    //   if (state.tabs) state.tabs.push(newTab)
    //   else state.tabs = [newTab]
    //   state.activeTab = newTab
    //   setState(state)
    // },
    openDevtool: () => window.api.invoke('toggleDevTools'),
    close: () => window.api.invoke('window-close'),
    min: () => window.api.invoke('window-minimize'),
    max: () => window.api.invoke('window-maximize'),
    reload: () => window.location.reload(),
  }

  React.useEffect(() => {
    // window.api.onNewTab(async (res) => {
    //   // const { data } = res
    //   // const id = Date.now().toString()

    //   // console.log('newTab', res)
    //   // if (!state.tabs) state.tabs = [id]
    //   // else state.tabs.push(id)
    //   // state.activeTab = id
    //   // setState(state)
    //   // info[id] = {
    //   //   id,
    //   //   ...data,
    //   // }
    //   // setInfo(info)
    // })
  }, [])

  // console.log('@ ~ usePageState ~ state:', state)

  return {
    tabs,
    state,
    handle,
  }
}
