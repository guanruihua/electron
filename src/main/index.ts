import { app, BrowserWindow, globalShortcut } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { ipcMainHandle } from './on/handle'
import { createBrowserWindow } from './gen/create-browser-window'
import { registerShortcuts } from './on/shortcuts'
// import { on_webview } from './on/webview'

// app.setPath('cache', app.getPath('userData') + '\\Cache')
// app.disableHardwareAcceleration()
// app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled')
// app.commandLine.appendSwitch('disable-renderer-backgrounding')
// app.commandLine.appendSwitch('disable-background-timer-throttling')
// app.commandLine.appendSwitch('enable-features', 'GlobalShortcutsPortal')

let mainWindow: BrowserWindow | null = null

app.whenReady().then(async () => {
  // electronApp.setAppUserModelId('com.electron')

  mainWindow = createBrowserWindow()

  ipcMainHandle(mainWindow)
  registerShortcuts(mainWindow)
  // on_webview(mainWindow)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  mainWindow.on('closed', () => {
    mainWindow = null // 释放内存引用
  })

  // app.on('browser-window-focus', () => {
  //   registerShortcuts(mainWindow)
  // })

  // app.on('before-quit', () => {
  //   console.log('Quit APP...')
  //   // # 3. 停止所有 node.exe 进程
  //   // cmd.run('taskkill /F /IM node.exe')
  // })

  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })

  // app.on('activate', function () {
  // if (BrowserWindow.getAllWindows().length === 0) mainWindow = createBrowserWindow()
  // mainWindow && registerShortcuts(mainWindow)
  // })
})

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    // if (expressServer) {
    //   await stopServer(expressServer)
    // }
    app.quit()
  }
})
