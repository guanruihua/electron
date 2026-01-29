import React from 'react'
import { useSetState } from '0hook'
import { PageState } from './type'

export const usePageState = () => {
  const [state, setState] = useSetState<PageState>({
    activeTab: '01',
    tabs: [
      '01',
      '1',
      // '2', '3', '4',
      '5',
    ],
  })

  const [info, setInfo] = React.useState({
    1: {
      id: '1',
      title: 'Qubit Safe',
      // url: 'http://172.16.30.53:5173/discovery',
      url: 'https://guanruihua.github.io/#/',
    },
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
    5: {
      id: '5',
      title: 'Electron',
      url: 'https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewisloading',
    },
  })

  const getID = () => Date.now().toString()
  const cache = React.useRef<any>(null)

  // console.log('🚀 ~ usePageState ~ state:', state)
  React.useEffect(() => {
    window.api.onNewTab(async (res) => {
      const { data, timestamp } = res
      const id = String(timestamp)

      // console.log('newTab', res)
      if (!state.tabs) state.tabs = [id]
      else state.tabs.push(id)
      state.activeTab = id
      setState(state)
      info[id] = {
        id,
        ...data,
      }
      setInfo(info)
    })
  }, [])

  return {
    info,
    state,
    setState,
    handle: {
      updateTabInfo(tab) {
        const newInfo = info || {}
        newInfo[tab.id] = { ...newInfo[tab.id], ...tab }
        cache.current = newInfo
        setInfo(cache.current)
      },
      updateTab(tab) {
        const newInfo = info || {}
        newInfo[tab.id] = { ...newInfo[tab.id], ...tab }
        setInfo(newInfo)
      },
      closeTab(id) {
        if (!state.tabs) state.tabs = []
        const newTabs = state.tabs.filter((_) => _ !== id) || []
        delete info[id]
        setState(info)
        setState({
          tabs: newTabs,
          activeTab: newTabs?.at(-1) || '',
        })
      },
      addTab() {
        const newTab = getID()
        if (state.tabs) state.tabs.push(newTab)
        else state.tabs = [newTab]
        state.activeTab = newTab
        setState(state)
      },
      openDevtool: () => window.api.invoke('toggleDevTools'),
      close: () => window.api.close(),
      min: () => window.api.minimize(),
      max: () => window.api.maximize(),
      reload: () => window.location.reload(),
    },
  }
}
