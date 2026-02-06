import { ipcMain, BrowserWindow, webContents } from 'electron'
import { getStartMenu, StoreManager } from './utils'
import { AppSize } from '../preload/type'
import { createScreenMask } from './register/create-screen-mask'
import { ObjectType } from '0type'
import { isString } from 'asura-eye'
import { cmd } from './helper'

export const ipcMainHandle = (mainWindow: BrowserWindow) => {
  const store = new StoreManager()
  const Conf = {

    cmd: async (_e, conf: ObjectType | string) => {
      console.log('Command:', conf)
      if (isString(conf)) return await cmd.run(conf)
      return undefined
    },
    dev: async (_e, conf: ObjectType | string) => {
      console.log('Server Command:', conf)
      if (isString(conf)) return await cmd.dev(conf)
      return undefined
    },
    'open-mask-window': () => {
      createScreenMask()
      ipcMain.handle('resize-mask-window', (_, zoom) => {
        console.log('resize-mask-window / mask: ', zoom)
      })
    },
    // 'resize-mask-window': (_, zoom) => {
    //   console.log('resize-mask-window / main: ', zoom)
    // },
    toggleDevTools: () => {
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools()
      } else {
        mainWindow.webContents.openDevTools({
          mode: 'bottom',
        })
      }
    },
    'window-minimize': () => mainWindow.minimize(),
    'window-unmaximize': () => mainWindow.unmaximize(),
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
      // if (mainWindow.isFullScreen()) return
      // const { height } = conf
      // if (!height) return
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
