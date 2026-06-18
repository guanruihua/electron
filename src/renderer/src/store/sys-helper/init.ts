import { SysState } from '@/type'
import { getApps, getFile, getModules, getSetting } from '@/util'
import { initUserInfo } from './user-info'

export const getSysInitState = async (): Promise<SysState> => {
  const path = 'D:\\Data\\electron'
  const env = await getFile(path + '\\env.json')
  if (!env.uid) env.uid = 'ruihuag'
  // console.log(env)
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
    env,
    userInfo: {
      uid: env.uid,
      weatherInfo: [],
    },
    ignoreApps,
    quickStarts,
    selectedQuickStart,
    selectProject,

    NodeTreads: [],
    modules,
    apps,

    innerCol: 1,
    runningUIDMapPID: {},
  }

  const list = ['db', 'weather-db']
  for (let val of list) {
    const res = await window.api.db({
      action: 'init',
      DBName: val,
      payload: {
        path,
      },
    })

    if (res.data) {
      console.log(`[Success] Init DB: "${val}"`)
    } else {
      console.log(`[Error] Init DB: "${val}"`)
    }
  }

  await initUserInfo(newState)
  // console.log({
  //   setting,
  //   modules,
  //   apps,
  // })
  return newState
}
