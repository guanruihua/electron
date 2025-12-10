import fs from 'fs'
import path from 'path'
import { shell, app } from 'electron'

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

export const getStartMenu = async () => {
  const path = 'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs'
  return await read(path)
}
