import React from 'react'
import { useSetState } from '0hook'
import { State, ViewStates } from './type'
import { isArray, isString } from 'asura-eye'
import { handleSetting, setStatus_NodeTread, toNodeTreads } from './helper'
import { ObjectType } from '0type'

export const usePageState = () => {
  const [state, _renderState] = useSetState<State>({
    activeTab: '01',
    tabs: [
      '01',
      // '1',
      // '2', '3', '4',
      // '5',
    ],
    NodeTreads: [],
    timeline: [],
    setting: {
      path: 'D:\\Data\\electron',
    },
    modules: [],
  })
  const renderState = () => _renderState(state)

  const setState = (newState: Partial<State>) => {
    for (let key in newState) {
      state[key] = newState[key]
    }
  }

  const [info, setInfo] = React.useState<ViewStates>({
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
  })

  const getID = () => Date.now().toString()
  const cache = React.useRef<any>(null)

  const handle = {
    setState,
    renderState,
    async handleSaveSetting(values: ObjectType = state?.setting || {}) {
      const { code, setting, modules } = await handleSetting(values)
      if (code === -1) return
      setState({
        setting,
        modules,
      })
      state.NodeTreads && setStatus_NodeTread(state.NodeTreads)
    },
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
      async dev(item: ObjectType, render: boolean = false) {
        if (!item.path || !item.npm) return
        await window.api.invoke(
          'dev',
          [`cd ${item.path}`, `npm.cmd run ${item.npm}`].join(' && '),
        )
        await this.findAll(render)
      },
      async stopAll(render: boolean = false) {
        await window.api.invoke('cmd', 'taskkill /F /IM node.exe')
        await this.findAll(render)
      },
      async stopModule(item: ObjectType, render: boolean = false) {
        if (!item.path) return
        const selector = `.opt-item[data-path="${item.path.replaceAll('\\', '>')}"]`
        const dom: HTMLDivElement | null = document.querySelector(selector)
        if (!dom) return
        const pids = [...new Set(dom.dataset.pid?.split(' '))]
        for (let i = 0; i < pids.length; i++) {
          const pid = pids[i]
          await window.api.invoke('cmd', `taskkill /PID ${pid} /F`)
        }
        await this.findAll(render)
      },
      async stop(nodeTread: ObjectType, render: boolean = false) {
        if (!nodeTread.pid) return
        await window.api.invoke('cmd', `taskkill /PID ${nodeTread.pid} /F`)
        await this.findAll(render)
      },
      async findAll(render: boolean = false) {
        const res = await window.api.invoke('cmd', 'tasklist | findstr node')
        if (!isString(res)) return
        const NewNodeTreads = toNodeTreads(res)
        state.NodeTreads = NewNodeTreads || []

        setState(state)
        setStatus_NodeTread(state.NodeTreads)
        render && renderState()
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

  const init = async () => {
    await handle.handleSaveSetting()
    await handle.NodeThread.findAll()
    handle.renderState()
  }
  // console.log('🚀 ~ usePageState ~ state:', state)
  React.useEffect(() => {
    init()
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

  // console.log('@ ~ usePageState ~ state:', state)

  return {
    info,
    state,
    handle,
  }
}
