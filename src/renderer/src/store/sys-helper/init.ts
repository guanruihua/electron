import { SysState } from '@/type'
import { getApps, getModules, getSetting } from '@/util'

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

  // console.log({
  //   setting,
  //   modules,
  //   apps,
  // })
  return newState
}
