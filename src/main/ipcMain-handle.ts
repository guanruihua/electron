import { ipcMain, BrowserWindow, screen } from 'electron'
import { getStartMenu, handleStore } from './utils'
import { AppSize } from '../preload/type'
// import { getSystemApps } from './register/getRecentApps'

export const ipcMainHandle = (mainWindow: BrowserWindow) => {
  const Conf = {
    'window-minimize': () => mainWindow.unmaximize(),
    'window-maximize': () => mainWindow.maximize(),
    'window-close': () => mainWindow.close(),
    'get-startMenu': getStartMenu,
    // 监听最大化/还原的请求
    'toggle-maximize-window': () => {
      if (mainWindow.isMaximized()) {
        // 如果窗口已最大化，则还原
        mainWindow.unmaximize()
      } else {
        // 否则，最大化窗口
        mainWindow.maximize()
      }
    },
    'set-app-size': async (e, conf: AppSize) => {
      // console.log("🚀 ~ ipcMainHandle / setAppSize~ conf:")
      // console.log(conf)
      if (mainWindow.isFullScreen()) return
      const { height } = conf
      // if (!width || !height) return
      if (!height) return
      // mainWindow.setSize(Math.max(width, 900), height)
      // const width = mainWindow.getSize()[0]
      // mainWindow.setSize(width, height)
      const h = Math.min(Math.max(60, height), 600)
      // console.log("🚀 ~ ipcMainHandle ~ h:", h)
      
      mainWindow.setSize(900, h, false)
    },
    store: handleStore,
    test: async (data: any) => {
      return {
        // list: await getSystemApps()
      }
    },
  }
  for (const key in Conf) {
    ipcMain.handle(key, Conf[key])
  }
}
