import { isObject, isString } from 'asura-eye'
import { BrowserWindow, WebContentsView } from 'electron'

const ViewMap: Record<string, WebContentsView | null> = {}
const UrlMap: Record<string, string | null> = {}

// 当不再需要视图时，执行销毁
function destroyView(mainWindow: BrowserWindow, uid: string) {
  if (!ViewMap[uid]) return
  // 1. 从窗口中移除视图
  mainWindow.contentView.removeChildView(ViewMap[uid])

  // 2. 关闭 webContents 释放资源
  ViewMap[uid].webContents.close()

  // 3. 清理引用（可选）
  ViewMap[uid] = null
}

export async function webView(mainWindow: BrowserWindow, conf: any) {
  console.log('webView', conf)
  if (!isObject(conf)) return
  const { uid, url, type } = conf
  if (!uid) return

  const getBounds = (type?: 'show' | 'hidden') => {
    if (type === 'hidden') return { x: -100, y: 100, width: 1, height: 1 }
    return { x: 60, y: 136, width: 800, height: 600 }
  }

  if (isString(url) && !isString(type)) {
    if (ViewMap[uid] && UrlMap[uid] !== url) {
      console.log(`[WebContentsView Init] update / url: ${url} uid: ${uid}`)

      ViewMap[uid].webContents.loadURL(url)
      UrlMap[uid] = url

      return new Promise((rs) => {
        if (!ViewMap[uid]) return rs(0)
        ViewMap[uid].webContents.on('did-finish-load', () => rs(1))
        ViewMap[uid].webContents.on('preload-error', () => rs(0))
      })
    }

    if (!ViewMap[uid]) {
      console.log(`[WebContentsView Init] url: ${url} uid: ${uid}`)
      ViewMap[uid] = new WebContentsView()

      mainWindow.contentView.addChildView(ViewMap[uid])
      ViewMap[uid].webContents.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      )
      ViewMap[uid].webContents.loadURL(url)
      UrlMap[uid] = url

      return new Promise((rs) => {
        if (!ViewMap[uid]) return rs(0)
        ViewMap[uid].webContents.on('did-finish-load', () => rs(1))
        ViewMap[uid].webContents.on('preload-error', () => rs(0))
      })
    }

    return 2
  }

  if (isString(type) && ViewMap[uid]) {
    switch (type) {
      case 'destroy':
        return destroyView(mainWindow, uid)
      case 'get-url':
        return ViewMap[uid].webContents.getURL()
      case 'get-html':
        const html = await ViewMap[uid].webContents.executeJavaScript(
          'document.documentElement.outerHTML',
        )
        return html
      case 'reload':
        ViewMap[uid].webContents.reload()
        return
      case 'show':
        ViewMap[uid].setBorderRadius(12)
        ViewMap[uid].setBounds(getBounds())
        return
      case 'hidden':
        ViewMap[uid].setBounds(getBounds('hidden'))
        return
      default:
        break
    }
  }
}

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
