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

      preload: path.join(__dirname, '../preload/index.js'),

      // 安全相关
      sandbox: false, // 设为 false 确保完整功能
      // allowRunningInsecureContent: false,

      // sandbox: false,
      webviewTag: true,
      contextIsolation: true,
      // contextIsolation: false,
      nodeIntegration: false,
      nodeIntegrationInWorker: true,
      enablePreferredSizeMode: true,
      session: persistentSession,

      webSecurity: false,
      allowRunningInsecureContent: true,
      enableWebSQL: true,

      experimentalFeatures: true,
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
    // console.log('✅ Webview 被附加，设置监听器...')

    // 为 webview 的内容设置窗口打开处理器
    webContents.setWindowOpenHandler((details) => {
      console.log('Webview / new Window:', details)
      // console.log('URL:', details.url);
      // console.log('Features:', details.features);
      // console.log('Frame:', details.frameName);
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
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

  // 应用失去焦点时
  app.on('browser-window-blur', () => {
    // 可选的：失去焦点时停用某些快捷键
  })

  // 应用获得焦点时
  app.on('browser-window-focus', () => {
    registerShortcuts(mainWindow)
  })

  // 应用退出前
  app.on('before-quit', () => {
    console.log('Quit APP...')
    // # 3. 停止所有 node.exe 进程
    // taskkill /F /IM node.exe
    cmd.run('taskkill /F /IM node.exe')
  })
  // 应用即将退出时
  app.on('will-quit', () => {
    // 注销所有全局快捷键
    globalShortcut.unregisterAll()
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    registerShortcuts(mainWindow)
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    // if (expressServer) {
    //   await stopServer(expressServer)
    // }
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
