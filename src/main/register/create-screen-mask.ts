import { BrowserWindow, screen } from 'electron'
import icon from '../../../resources/icon.png?asset'
import { ScreenMaskTmp } from './screen-mask-tmp'

let maskWindow: BrowserWindow | undefined = undefined

export const createScreenMask = async () => {
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
      // preload: 'src/preload/index.js',
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

  maskWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(ScreenMaskTmp)}`,
  )
  maskWindow.show()
  maskWindow.on('close', () => {
    maskWindow?.destroy()
    maskWindow = undefined
  })
}
