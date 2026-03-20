import { ObjectType } from '0type'
import { isObject, isString } from 'asura-eye'
import fs from 'fs/promises' // 异步文件操作
import path from 'path' // 路径处理

// 目标目录路径（注意转义反斜杠，或使用正斜杠）
const targetDir = 'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs'
const userTargetDir =
  'C:\\Users\\ruihuag\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs'
// 也可以写成：const targetDir = 'C:/ProgramData/Microsoft/Windows/Start Menu/Programs';

/**
 * 递归读取目录下的所有文件
 * @param {string} dir - 要读取的目录路径
 * @returns {Array} - 包含文件信息的数组
 */
async function readAllFiles(dir) {
  let fileList: [string, string][] = []

  try {
    // 读取当前目录下的所有文件/目录
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      // 拼接完整路径
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        // 如果是目录，递归读取子目录
        const subDirFiles = await readAllFiles(fullPath)
        fileList.push(...subDirFiles)
        // fileList = fileList.concat(subDirFiles)
      } else if (entry.isFile()) {
        // 如果是文件，添加到数组中
        const fileName = entry.name.trim()
        const flag =
          !fileName.endsWith('.lnk') ||
          fileName.endsWith(' Help') ||
          fileName.startsWith('卸载') ||
          fileName.startsWith('Uninstall ') ||
          fileName.indexOf('Install') > -1 ||
          fileName.indexOf('Ubuntu') > -1 ||
          fileName.startsWith('Developer') ||
          fileName.startsWith('Debuggable') ||
          fileName.startsWith('AutoHotkey') ||
          fileName.startsWith('Python') ||
          fileName.startsWith('WSL') ||
          fileName.startsWith('Git') ||
          fileName.startsWith('Razer') ||
          fileName.startsWith('x64') ||
          fileName.startsWith('x86')
        if (!flag) {
          fileList.push([
            fullPath, // 完整文件路径
            fileName.replace('.lnk', ''), // 文件名（含扩展名）
          ])
        }
      }
    }
  } catch (err) {
    console.error('Error occurred while reading the directory. / ', err)
  }

  return fileList.reverse()
}

export const updateApps = async (target: ObjectType | string) => {
  console.log('updateApps', target, isObject(target))
  if (!isObject(target) || !isString(target?.path)) return

  console.log(`Starting to read the table of contents：${targetDir}`)

  const result = await readAllFiles(targetDir)
  console.log('update Apps', target, result?.length)

  const userResult = await readAllFiles(userTargetDir)
  console.log('update User Apps', target, userResult?.length)


  const output = `${target.path}\\apps.json`
  const data = userResult.concat(result)

  await fs.writeFile(output, JSON.stringify(data, null, 2))

  console.log(`\nThe result has been saved in the ${output} file.`)

  return data
}
