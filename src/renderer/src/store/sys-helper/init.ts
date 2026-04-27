import { SysState } from '@/type'
import {
  getApps,
  getModules,
  getSetting,
  setStatus_NodeTread,
  toNodeTreads,
} from '@/util'
import { isString } from 'asura-eye'

export const getSysInitState = async (): Promise<SysState> => {
  const path = 'D:\\Data\\electron'

  const setting = await getSetting(path)

  const modules = await getModules(path)
  const apps = await getApps(path)

  const {
    // path = 'D:\\Data\\electron',
    ignoreApps = 'AsHotplugCtrl,NVIDIA,输入法,x86,Help',
    quickStarts = [],
    selectedQuickStart = 0,
    selectProject,
  } = setting || {}

  const newState: SysState = {
    initSuccess: true,
    path,
    ignoreApps,
    quickStarts,
    selectedQuickStart,
    selectProject,

    NodeTreads: [],
    modules,
    apps,
  }

  const res = await window.api.invoke('cmd', 'tasklist | findstr node')
  if (isString(res)) {
    newState.NodeTreads = toNodeTreads(res) || []
    setStatus_NodeTread(newState.NodeTreads)
  }

  console.log({
    setting,
    modules,
    apps,
  })
  return newState
}
