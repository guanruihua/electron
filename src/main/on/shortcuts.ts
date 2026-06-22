import { isNumber } from 'asura-eye'
import { BrowserWindow, globalShortcut, screen } from 'electron'
// import { createScreenMask } from '../gen/create-screen-mask'

export const registerShortcuts = (mainWindow: BrowserWindow) => {
  console.log('Register / Shortcuts')
  const win = mainWindow
  let isMoving: boolean = false

  const handle = {
    moveToCursor() {
      console.log('Window Moved Start...')
      // if (win.isVisible()) {
      //   win.minimize()
      //   return
      // }

      const { x, y } = screen.getCursorScreenPoint()
      const { width = 0, height = 0 } = win.getBounds()
      let newX = x
      let newY = y + 10
      const displays = screen.getAllDisplays()?.map((_) => _.bounds)
      console.log('Window Moved Start...', 4)
      for (const b of displays) {
        if (
          // x
          x >= b.x &&
          x <= b.width + b.x &&
          // y
          y >= b.y &&
          y <= b.height + b.y
        ) {
          const nx = Math.max(
            5 + b.x,
            Math.min(b.width + b.x - 5, x - width / 2),
          )
          if (isNumber(nx)) newX = nx

          const ny = Math.max(
            5 + b.y,
            Math.min(b.height + b.y - 5, y - height / 2),
          )

          if (isNumber(ny)) newY = ny
          break
        }
      }

      if (!isNumber(newX) || !isNumber(newY)) return
      console.log('Window Moved / setPosition / before', newX, newY)
      try {
        win.setPosition(newX, newY)
      } catch (error) {
        console.error(error)
      }
      console.log('Window Moved / setPosition / after', newX, newY)
      // 如果窗口被最小化，先恢复它
      if (win.isMinimized()) {
        win.restore()
      }
      // 显示窗口（如果隐藏了）
      if (!win.isVisible()) {
        win.show()
      }

      // 将窗口置于所有窗口之上（临时置顶）
      // 注意：setAlwaysOnTop 会改变窗口层级，建议操作后取消置顶，以免影响后续交互
      // win.setAlwaysOnTop(true, 'normal')
      // 确保窗口获得焦点（在 Windows 上通常还需要调用 win.focus()）
      win.focus()
      // 延迟后取消置顶（30ms 足以完成置顶动作，避免窗口一直浮在最上）
      // setTimeout(() => {
      //   win.setAlwaysOnTop(false)
      // }, 30)
      console.log('Window Moved End...')
    },
  }

  const Conf = {
    'Ctrl+Y': () => {
      if (isMoving) return
      isMoving = true
      try {
        handle.moveToCursor()
      } catch (error) {
        console.error(error)
      } finally {
        isMoving = false
      }
    },
    //   // 'CommandOrControl+Shift+F10': () => {
    //   F10: () => {
    //     // console.log('f10')
    //     createScreenMask()
    //     // mainWindow.webContents.focus()
    //   },
  }

  for (let key in Conf) {
    try {
      console.log(globalShortcut.isRegistered(key))
      const status = globalShortcut.register(key, Conf[key])
      console.log('registerShortcuts', key, '/ Status:', status)
    } catch (error) {
      console.log('Global Shortcut Register Error:', error)
    }
  }
}
