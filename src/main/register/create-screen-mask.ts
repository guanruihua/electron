import { BrowserWindow, screen } from 'electron'
import icon from '../../../resources/icon.png?asset'
import h5 from '../../../resources/fullscreen.html?asset'

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
    height,
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
      // preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      nodeIntegrationInWorker: true,
      enablePreferredSizeMode: true,
      // session: persistentSession,
    },
  })

  maskWindow.loadFile(h5, {
    hash: '/screen-mask',
  })
  maskWindow.show()

  maskWindow.on('close', () => {
    maskWindow?.destroy()
    maskWindow = undefined
  })
}
