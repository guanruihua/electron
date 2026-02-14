import { BrowserWindow } from 'electron'

export function on_webview(mainWindow: BrowserWindow) {
  // 1. 监听 webview 被附加到 DOM
  mainWindow.webContents.on('did-attach-webview', (_event, webContents) => {
    webContents.on('before-input-event', (_e, input) => {
      console.log('before-input-event: ', input.key)
      if (input.key === 'F12') {
        if (webContents.isDevToolsOpened()) {
          webContents.closeDevTools()
        } else {
          webContents.openDevTools({
            mode: 'bottom',
          })
        }
      }
    })
    // 为 webview 的内容设置窗口打开处理器
    webContents.setWindowOpenHandler((details) => {
      console.log('Webview / new Window:', details)
      mainWindow.webContents.send('newTabEvent', {
        type: 'newTab',
        data: details,
      })
      // 在外部浏览器打开
      // shell.openExternal(details.url);

      return { action: 'deny' }
    })

    // 可选：监听 webview 的导航
    // webContents.on('did-navigate', (event, url) => {
    //   console.log('Webview 导航到:', url)
    // })

    // 可选：监听 webview 的 console
    // webContents.on('console-message', (event, level, message) => {
    //   console.log(`Webview 日志 [${level}]:`, message)
    // })
  })
}
