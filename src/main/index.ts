import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  protocol,
  session,
  globalShortcut,
} from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
// import { startServer, stopServer } from './server'
import { ipcMainHandle } from './ipcMain-handle'
import { registerShortcuts } from './register/shortcuts'
// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
// @ts-ignore (define in dts)

let mainWindow
// let expressServer
function createWindow(): void {
  const persistentSession = session.fromPartition('persist:mycache', {
    cache: true,
  })
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    // height: 120,
    show: false,
    resizable: true,
    icon,
    titleBarStyle: 'hidden', // 或 'hiddenInset' (macOS)
    frame: false, // 无边框窗口（隐藏标题栏和边框）
    autoHideMenuBar: true, // 自动隐藏菜单栏（按 Alt 键显示）
    center: true,
    backgroundColor: '#00000000',
    transparent: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      nodeIntegrationInWorker: true,
      enablePreferredSizeMode: true,
      session: persistentSession,
    },
  })

  // mainWindow.maximize()
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
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '/home',
    })
  }
  ipcMainHandle(mainWindow)
  registerShortcuts(mainWindow)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // 安装 React DevTools 扩展
  // installExtension(REACT_DEVELOPER_TOOLS)
  //   .then((name) => console.log(`已添加扩展: ${name}`))
  //   .catch((err) => console.log('安装扩展时发生错误: ', err))

  // try {
  //   const reactDevToolsPath = path.join(__dirname, '../../resources/extensions/react-devtools.zip');
  //   // session.defaultSession.loadExtension

  //   const { name, version } = await session.defaultSession.loadExtension(reactDevToolsPath);

  //   console.log(`已加载扩展: ${name} (v${version})`);
  // } catch (error) {
  //   console.error('加载扩展失败:', error);
  // }

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 注册一个名为 'safe-img' 的自定义协议
  // protocol.registerFileProtocol('safe-img', (request, callback) => {
  //   const url = request.url.replace('safe-img://', '') // 移除协议头
  //   const decodedUrl = decodeURI(url) // 解码URL，处理中文路径
  //   try {
  //     callback(decodedUrl)
  //   } catch (error) {
  //     console.error('Error loading image:', error)
  //   }
  // })

  // IPC test
  // ipcMain.on('ping', () => console.log('pong'))
  // expressServer = await startServer()
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
