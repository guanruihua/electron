import { BrowserWindow, globalShortcut } from 'electron'
import { createScreenMask } from './create-screen-mask'

export const registerShortcuts = (mainWindow: BrowserWindow) => {
  const Conf = {
    // 打开开发者工具
    F12: () => {
      console.log('Click F12 ...')
      // mainWindow.webContents.toggleDevTools()
      // if (mainWindow.webContents.isDevToolsOpened()) {
      //   mainWindow.webContents.closeDevTools()
      // } else {
      //   mainWindow.webContents.openDevTools({
      //     mode: 'bottom',
      //   })
      // }
    },
    'CommandOrControl+Shift+F12': () => {
      mainWindow.webContents.focus()
    },
    // 'CommandOrControl+Shift+F10': () => {
    F10: () => {
      // console.log('f10')
      createScreenMask()
      // mainWindow.webContents.focus()
    },
    F11: () => {
      console.log('F11')
      // createScreenMask()
      // mainWindow.webContents.focus()
    },
    // 'Alt+V': () => {
    //   mainWindow.webContents.send('shortcut-info', {
    //     shortcut: 'Alt+V',
    //     type: 'mini-tool',
    //     timestamp: Date.now(),
    //   })
    //   // mainWindow.setSize(900, 50)
    //   // mainWindow.webContents.focus()
    //   if (mainWindow.isFocused()) {
    //     mainWindow.hide()
    //     return
    //   }
    //   mainWindow.show()
    // },
  }

  for (let key in Conf) {
    try {
      // console.log(globalShortcut.isRegistered(key))
      const status = globalShortcut.register(key, Conf[key])
      console.log('registerShortcuts', key, '/ status:', status)
    } catch (error) {
      console.log('Global Shortcut Register Error:', error)
    }
  }
}
