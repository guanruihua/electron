import { BrowserWindow, globalShortcut } from 'electron'

export const registerShortcuts = (mainWindow: BrowserWindow) => {
  const Conf = {
    // 打开开发者工具
    F12: () => {
      mainWindow.webContents.toggleDevTools()
    },
    'CommandOrControl+Shift+F12': () => {
      mainWindow.webContents.focus()
    },
    'Alt+V': () => {
      mainWindow.webContents.send('shortcut-info', {
        shortcut: 'Alt+V',
        type: 'mini-tool',
        timestamp: Date.now(),
      })
      mainWindow.setSize(900, 50)
      mainWindow.webContents.focus()
    },
  }

  for (let key in Conf) {
    try {
      // console.log(globalShortcut.isRegistered(key))
      globalShortcut.register(key, Conf[key])
    } catch (error) {
      console.log('Global Shortcut Register Error:', error)
    }
  }
}
