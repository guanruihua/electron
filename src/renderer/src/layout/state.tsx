import React from 'react'
import { useSetState } from '0hook'
import { State, ViewStates } from '@/type'

export const usePageState = () => {
  const [state, _renderState] = useSetState<State>({
    activeTab: '01',
    tabs: [
      // '01',
      // '02',
      // '2', '3', '4',
      // '5',
      {
        id: '01',
        title: 'Dashboard',
        type: 'dashboard',
      },
      {
        id: '02',
        title: 'File Resource Management',
        type: 'fsm',
        // url: 'http://172.16.30.53:5173/discovery',
        url: 'D:\\',
      },
      // 1: {
      //   id: '1',
      //   title: 'Qubit Safe',
      //   // url: 'http://172.16.30.53:5173/discovery',
      //   url: 'https://guanruihua.github.io/#/',
      // },
      // 2: {
      //   id: '2',
      //   title: 'Bing',
      //   url: 'https://www.bing.com',
      // },
      // 3: {
      //   id: '3',
      //   title: 'Baidu',
      //   url: 'https://www.baidu.com',
      // },
      // 4: {
      //   id: '4',
      //   title: 'Google',
      //   url: 'https://www.google.com',
      // },
      // 5: {
      //   id: '5',
      //   title: 'Electron',
      //   url: 'https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewisloading',
      // },
    ],
  })
  const renderState = () => _renderState(state)

  const setState = (newState: Partial<State>) => {
    for (let key in newState) {
      state[key] = newState[key]
    }
  }

  const getID = () => Date.now().toString()
  const cache = React.useRef<any>(null)

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
    close: () => window.api.close(),
    min: () => window.api.minimize(),
    max: () => window.api.maximize(),
    reload: () => window.location.reload(),
  }

  React.useEffect(() => {
    window.api.onNewTab(async (res) => {
      // const { data } = res
      // const id = Date.now().toString()

      // console.log('newTab', res)
      // if (!state.tabs) state.tabs = [id]
      // else state.tabs.push(id)
      // state.activeTab = id
      // setState(state)
      // info[id] = {
      //   id,
      //   ...data,
      // }
      // setInfo(info)
    })
  }, [])

  // console.log('@ ~ usePageState ~ state:', state)

  return {
    state,
    handle,
  }
}
