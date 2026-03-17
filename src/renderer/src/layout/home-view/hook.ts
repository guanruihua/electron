import React from 'react'
import { useSetState } from '0hook'
import { State } from '../type'
import { isString } from 'asura-eye'
import {
  handleSetting,
  saveSettingToFile,
  setStatus_NodeTread,
  toNodeTreads,
} from '../helper'
import { ObjectType } from '0type'
import { DefaultState } from './conf'
import { useLoadings } from '@/util'

export const useHomeView = () => {
  const [loadings, setLoadings] = useLoadings({
    nodeThread: false,
    stopAll: false,
    findAll: false,
  })

  const [state, _renderState] = useSetState<State>({
    NodeTreads: [],
    setting: DefaultState.setting,
    modules: [],
    apps: [],
  })

  const saveToFile = (type: 'setting' | 'modules' | 'apps') => {
    const { path } = state?.setting || {}
    if (!path) return
    if (type === 'setting') saveSettingToFile(path, state.setting)
  }
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

  const findAll_NodeThread = async (render: boolean = false) => {
    const res = await window.api.invoke('cmd', 'tasklist | findstr node')
    if (!isString(res)) {
      state.NodeTreads = []
    } else {
      state.NodeTreads = toNodeTreads(res) || []
    }

    handle.setState(state)
    setStatus_NodeTread(state.NodeTreads)
    render && handle.renderState()
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
    findAll: findAll_NodeThread,
  }

  const handle = {
    setLoadings,
    setState,
    renderState,
    saveToFile,
    findAll_NodeThread,

    NodeThread: handleNodeThread,
    async git(item) {
      if (setDefaultState(state)) state.setting.selectGitModule = item
      renderState()
      saveToFile('setting')
    },
    async handleSaveSetting(values: ObjectType = state?.setting || {}) {
      const { code, apps, setting, modules } = await handleSetting(values)
      if (code === -1) return
      setState({
        apps,
        setting,
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
    setDefaultState,
  }

  const init = async () => {
    await handle.handleSaveSetting()
    await handle.NodeThread.findAll()

    if (
      setDefaultState(state) &&
      !state.setting?.selectGitModule?.path &&
      state?.modules?.[0]
    ) {
      state.setting.selectGitModule = state.modules[0]
    }
    handle.renderState()
  }

  React.useEffect(() => {
    init()
  }, [])

  return {
    loadings,
    state,
    handle,
  }
}
