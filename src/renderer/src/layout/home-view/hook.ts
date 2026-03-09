import React from 'react'
import { useSetState } from '0hook'
import { State, ViewStates } from '../type'
import { isArray, isString } from 'asura-eye'
import {
  getModules,
  handleSetting,
  setStatus_NodeTread,
  toNodeTreads,
} from '../helper'
import { ObjectType } from '0type'

export const useHomeView = () => {
  const [state, _renderState] = useSetState<State>({
    NodeTreads: [],
    setting: {
      path: 'D:\\Data\\electron',
    },
    modules: [],
    selectGitModule: {
      label: '',
      path: '',
    },
  })
  const renderState = () => _renderState(state)

  const setState = (newState: Partial<State>) => {
    for (let key in newState) {
      state[key] = newState[key]
    }
  }

  const handleModule = {
    async reload() {
      if (!state.setting?.path) return
      const modules = await getModules(state.setting.path)
      if(!state.selectGitModule?.path) state.selectGitModule = modules[0]
      setState({ modules })
      renderState()
    },
    async openConfFile() {
      state.setting?.path &&
        window.api.invoke('cmd', `code ${state.setting.path}\\modules.json`)
    },
  }
  const handleNodeThread = {
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
  }

  const handle = {
    setState,
    renderState,
    NodeThread: handleNodeThread,
    module: handleModule,
    async git(item) {
      setState({
        selectGitModule: item,
      })
      renderState()
    },
    async handleSaveSetting(values: ObjectType = state?.setting || {}) {
      const { code, setting, settings, modules } = await handleSetting(values)
      if (code === -1) return
      setState({
        setting,
        settings,
        modules,
      })
      state.NodeTreads && setStatus_NodeTread(state.NodeTreads)
      renderState()
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

  React.useEffect(() => {
    init()
  }, [])

  return {
    state,
    handle,
  }
}
