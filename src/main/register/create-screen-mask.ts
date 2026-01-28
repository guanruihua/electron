import { BrowserWindow, ipcMain, screen } from 'electron'
import icon from '../../../resources/icon.png?asset'
// import h5 from '../../../resources/fullscreen.html?asset'
import path from 'path'

let maskWindow: BrowserWindow | undefined = undefined

export const createScreenMask = async () => {
  console.log('🚀 ~ maskWindow:', maskWindow)
  if (maskWindow) {
    maskWindow.focus()
    return
  }
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  maskWindow = new BrowserWindow({
    width,
    height: height,
    show: false,
    resizable: true,
    icon,
    titleBarStyle: 'hidden', // 或 'hiddenInset' (macOS)
    frame: false, // 无边框窗口（隐藏标题栏和边框）
    autoHideMenuBar: true, // 自动隐藏菜单栏（按 Alt 键显示）
    center: true,
    backgroundColor: '#00000000',
    transparent: true,
    alwaysOnTop: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      // preload: path.join(__dirname, '../../preload/index.js'),
      preload: 'src/preload/index.js',
      sandbox: false,
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      nodeIntegrationInWorker: true,
      enablePreferredSizeMode: true,
      partition: 'screen-mask',
      // session: persistentSession,
    },
  })

  // maskWindow.loadFile(h5, {
  // maskWindow.loadFile(path.join(__dirname, '../../renderer/index.html'), {
  // maskWindow.loadFile(path.join(__dirname, '../../renderer/fullscreen.html'), {
  maskWindow.loadFile('src/renderer/fullscreen.html', {
    hash: '/screen-mask',
  })
  maskWindow.show()

  maskWindow.on('close', () => {
    maskWindow?.destroy()
    maskWindow = undefined
  })
}
