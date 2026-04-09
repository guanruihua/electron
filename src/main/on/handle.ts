import { ipcMain, BrowserWindow } from 'electron'
import { createScreenMask } from '../gen/create-screen-mask'
import { isString } from 'asura-eye'
import { getClipboard } from './clipboard'

import { cmd } from '../helper/cmd'
import { fileSystem } from '../helper/handle/file-system'
import { updateApps } from '../helper/updateApps'
import { getFileTree } from '../helper/get/file-tree'
import { getRunningApp } from '../helper/get/running-app'
import { stopAppByName } from '../helper/handle/stop-app'
import { getUserDataPath } from '../helper/get/user-info'
import { copy } from '../helper/handle/clipboard'
import { getSysInfo } from '../helper/get/sys-info/sys-info'

// import { Logger } from '../helper/logger'

export const ipcMainHandle = (mainWindow: BrowserWindow) => {
  // const logger = Logger(mainWindow)

  const Conf = {
    copy,
    getSysInfo,
    getClipboard,
    getUserDataPath,
    stopAppByName,
    getRunningApp,
    getFileTree,
    updateApps,
    fs: fileSystem,
    cmd: async (_e, conf: any) => {
      // console.log('Command:', conf)
      if (isString(conf)) return await cmd.run(conf)
      return undefined
    },
    cmdResult: async (_e, conf: any) => {
      // console.log('Command:', conf)
      if (isString(conf)) return await cmd.cmdResult(conf)
      return undefined
    },
    dev: async (_e, conf: any) => {
      // console.log('Server Command:', conf)
      if (isString(conf)) return await cmd.dev(conf)
      return undefined
    },
    'open-mask-window': () => createScreenMask(),
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
  }
  for (const key in Conf) {
    ipcMain.handle(key, Conf[key])
  }
}
