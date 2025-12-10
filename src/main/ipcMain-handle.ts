import { ipcMain, dialog, BrowserWindow, shell, app } from 'electron'
import fs from 'fs'
import path from 'path'

const read = async (dirPath: string) => {
  const exeFiles: any[] = []
  try {
    const files = await fs.readdirSync(dirPath, { withFileTypes: true })
    // exeFiles.push(...files)
    files.map(async (file) => {
      const fullPath = path.join(file.parentPath, file.name)

      if (file.isDirectory()) {
        // 递归读取子文件夹
        const subDirFiles = await read(fullPath)
        exeFiles.push(...subDirFiles)
      } else if (
        file.isFile() &&
        (file.name.toLowerCase().endsWith('.exe') ||
          file.name.toLowerCase().endsWith('.lnk'))
      ) {
        // exeFiles.push([fullPath, shell.readShortcutLink(fullPath)])
        const conf = shell.readShortcutLink(fullPath)
        let iconDataURL = ''
        if (conf.icon)
          // iconDataURL = await app.getFileIcon(conf.icon).then((res) => {
          iconDataURL = await app.getFileIcon(conf.icon).then((res) => {
            // console.log('🚀 ~ read ~ icon:', res.toDataURL())
            return res.toDataURL()
          })
        console.log('🚀 ~ read ~ iconDataURL:', iconDataURL)
        exeFiles.push({ ...conf, fullPath, iconDataURL })
      }
    })
  } catch (error) {}
  return exeFiles
}

export const ipcMainHandle = (mainWindow: BrowserWindow) => {
  const Conf = {
    'window-minimize': () => mainWindow.unmaximize(),
    'window-maximize': () => mainWindow.maximize(),
    'window-close': () => mainWindow.close(),
    'get-startMenu': async () => {
      const path = 'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs'
      return await read(path)
    },
    // 监听最大化/还原的请求
    'toggle-maximize-window': () => {
      if (mainWindow.isMaximized()) {
        // 如果窗口已最大化，则还原
        mainWindow.unmaximize()
      } else {
        // 否则，最大化窗口
        mainWindow.maximize()
      }
    },
  }
  for (const key in Conf) {
    ipcMain.handle(key, Conf[key])
  }

  ipcMain.handle('select-image-dir', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'], // 选择目录
    })
    if (!result.canceled) {
      const dirPath = result.filePaths[0]
      const files = fs.readdirSync(dirPath)
      // 过滤出图片文件
      const imageFiles = files
        .filter((file) => /\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(file))
        .map((file) => `safe-img://${path.join(dirPath, file)}`)
      return imageFiles
    }
    return []
  })
}
