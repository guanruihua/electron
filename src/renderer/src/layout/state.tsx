import React from 'react'
import { useSetState } from '0hook'
import { State, ViewStates } from './type'
import { isArray, isString } from 'asura-eye'
import { toNodeTreads } from './helper'

export const usePageState = () => {
  const [state, setState] = useSetState<State>({
    activeTab: '01',
    tabs: [
      '01',
      '1',
      // '2', '3', '4',
      // '5',
    ],
    NodeTreads: [],
    timeline: [],
  })

  const [info, setInfo] = React.useState<ViewStates>({
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
    // 5: {
    //   id: '5',
    //   title: 'Electron',
    //   url: 'https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewisloading',
    // },
  })

  const getID = () => Date.now().toString()
  const cache = React.useRef<any>(null)

  const handle = {
    setState,
    addTimePoint(info: any) {
      const item = {
        startTime: Date.now(),
        info,
      }
      if (isArray(state.timeline)) {
        state.timeline.push(item)
      } else {
        state.timeline = [item]
      }
      setState(state)
    },
    NodeThread: {
      async dev(item) {
        if (!item.path || !item.npm) return
        const res = await window.api.invoke(
          'dev',
          [`cd ${item.path}`, `npm.cmd run ${item.npm}`].join(' && '),
        )
        console.log('dev / result: ', res)
        await this.findAll()
      },
      async stopAll() {
        const res = await window.api.invoke('cmd', 'taskkill /F /IM node.exe')
        console.log('stop all / result: ', res)
        await this.findAll()
      },
      async stop(nodeTread) {
        if (!nodeTread.pid) return
        const res = await window.api.invoke(
          'cmd',
          `taskkill /PID ${nodeTread.pid} /F`,
        )
        await this.findAll()
        console.log(res)
      },
      async findAll() {
        console.log('click NodeThread / find all')
        const res = await window.api.invoke('cmd', 'tasklist | findstr node')
        if (!isString(res)) return
        console.log('🚀 ~ Opt ~ result:', res)
        const NewNodeTreads = toNodeTreads(res)
        const pids = state?.NodeTreads?.map((_) => _.pid) || []
        const now = Date.now()
        const getTitle = () => {
          const info = state.timeline?.filter((_) => _.startTime<=now).at(-1)?.info
          console.log(now, state.timeline)
          if(info?.label){
            return info?.label
          }
          return 'electron'
        }
        NewNodeTreads.forEach((item) => {
          if (!state.NodeTreads) state.NodeTreads = []
          if (pids.includes(item.pid)) return
          state.NodeTreads.push({
            startTime: now,
            title: getTitle(),
            ...item,
          })
        })
        setState(state)
      },
    },
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
      setInfo(info)
      setState({
        tabs: newTabs,
        activeTab: newTabs?.at(-1) || '',
      })
    },
    addTab(item?: any) {
      if (item) {
        const { id = getID() } = item
        state.activeTab = id
        if (!state.tabs) state.tabs = [id]
        else state.tabs.push(id)
        info[id] = {
          id,
          ...item,
        }
        setInfo(info)
        setState(state)
        return
      }
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
  }

  // console.log('🚀 ~ usePageState ~ state:', state)
  React.useEffect(() => {
    handle.NodeThread.findAll()

    window.api.onNewTab(async (res) => {
      const { data } = res
      const id = Date.now().toString()

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
    handle,
  }
}
