import { app, BrowserWindow, session, globalShortcut } from 'electron'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ipcMainHandle } from './ipcMain-handle'
import { registerShortcuts } from './register/shortcuts'
import webPreferences from './webPreferences'
import { cmd } from './helper'

let mainWindow: BrowserWindow
function createWindow(): void {
  const persistentSession = session.fromPartition('persist:mycache', {
    cache: true,
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 430,
    // show: false,
    resizable: true,
    icon,
    titleBarStyle: 'hidden', // 或 'hiddenInset' (macOS)
    // frame: false, // 无边框窗口（隐藏标题栏和边框）
    autoHideMenuBar: true, // 自动隐藏菜单栏（按 Alt 键显示）
    center: true,
    backgroundColor: '#00000000',
    // backgroundColor: '#00000000',
    // transparent: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      ...webPreferences,
      session: persistentSession,
      preload: path.join(__dirname, '../preload/index.js'),
      // enableBlinkFeatures: 'ClipboardCustomFormats,ClipboardRead',
    },
  })

  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: '/home',
    })
  }
  ipcMainHandle(mainWindow)
  registerShortcuts(mainWindow)

  // 1. 监听 webview 被附加到 DOM
  mainWindow.webContents.on('did-attach-webview', (event, webContents) => {
    // 为 webview 的内容设置窗口打开处理器
    webContents.setWindowOpenHandler((details) => {
      console.log('Webview / new Window:', details)
      mainWindow.webContents.send('newTabEvent', {
        type: 'newTab',
        data: details,
        timestamp: Date.now(),
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

  // const win = new BaseWindow({ width: 800, height: 400 })

  // const view1 = new WebContentsView()
  // view1.webContents.loadURL('https://electronjs.org')
  // view1.setBounds({ x: 0, y: 80, width: 1600, height: 800 })
  // mainWindow.contentView.addChildView(view1)

  // const view2 = new WebContentsView()
  // mainWindow.contentView.addChildView(view2)
  // view2.webContents.loadURL('https://github.com/electron/electron')
  // view2.setBounds({ x: 400, y: 0, width: 400, height: 400 })

  mainWindow.on('closed', () => {
    mainWindow = null as any // 释放内存引用
  })
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  // 应用激活时重新注册快捷键
  // app.on('activate', () => {
  //   if (BrowserWindow.getAllWindows().length === 0) {
  //     createWindow()
  //   }
  //   registerShortcuts(mainWindow)
  // })

  // app.on('browser-window-blur', () => {
  //   // 可选的：失去焦点时停用某些快捷键
  // })

  app.on('browser-window-focus', () => {
    registerShortcuts(mainWindow)
  })

  app.on('before-quit', () => {
    console.log('Quit APP...')
    // # 3. 停止所有 node.exe 进程
    cmd.run('taskkill /F /IM node.exe')
  })
  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    registerShortcuts(mainWindow)
  })
})

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    // if (expressServer) {
    //   await stopServer(expressServer)
    // }
    app.quit()
  }
})
