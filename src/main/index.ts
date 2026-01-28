import {
  app,
  shell,
  BrowserWindow,
  session,
  globalShortcut,
  screen,
} from 'electron'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ipcMainHandle } from './ipcMain-handle'
import { registerShortcuts } from './register/shortcuts'

let mainWindow: BrowserWindow
function createWindow(): void {
  const persistentSession = session.fromPartition('persist:mycache', {
    cache: true,
  })
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  console.log('🚀 ~ createWindow ~ width:', width, height)

  // Create the browser window.
  mainWindow = new BrowserWindow({
    // width: 900,
    // height: 430,
    width,
    height,
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
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
      nodeIntegrationInWorker: true,
      enablePreferredSizeMode: true,
      session: persistentSession,
      allowRunningInsecureContent: true,
    },
  })

  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
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
  // mainWindow.webContents.toggleDevTools()
  mainWindow.webContents.openDevTools({
    mode: 'bottom',
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
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
    registerShortcuts(mainWindow)
  })

  // 应用失去焦点时
  app.on('browser-window-blur', () => {
    // 可选的：失去焦点时停用某些快捷键
  })

  // 应用获得焦点时
  app.on('browser-window-focus', () => {
    registerShortcuts(mainWindow)
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
