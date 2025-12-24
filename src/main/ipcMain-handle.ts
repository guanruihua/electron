import { ipcMain, BrowserWindow } from 'electron'
import { getStartMenu, StoreManager } from './utils'
import { AppSize } from '../preload/type'

export const ipcMainHandle = (mainWindow: BrowserWindow) => {
  const store = new StoreManager()
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
    'set-app-size': async (_e, conf: AppSize) => {
      console.log('ipcMainHandle / setAppSize~ conf:', conf)
      if (mainWindow.isFullScreen()) return
      const { height } = conf
      if (!height) return
      // const h = Math.min(Math.max(60, Number(height)), 600)
      // mainWindow.setSize(900, h, false)
    },
    store: store.handleStore,
    test: async (_e, payload: any = {}) => {
      console.log('test ~ ipcMainHandle ~ data:', payload)

      return {
        // list: await getSystemApps()
      }
    },
  }
  for (const key in Conf) {
    ipcMain.handle(key, Conf[key])
  }
}
