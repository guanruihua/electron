import { BrowserWindow, session } from 'electron'
import path from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'
import webPreferences from './webPreferences'

export function createBrowserWindow(): BrowserWindow {
  const persistentSession = session.fromPartition('persist:mycache', {
    cache: true,
  })
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 430,
    resizable: true,
    icon,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    center: true,
    backgroundColor: '#00000000',
    webPreferences: {
      ...webPreferences,
      session: persistentSession,
      preload: path.join(__dirname, '../preload/index.js'),
    },
  })
  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: '/home',
    })
  }
  return mainWindow
}
