import { ObjectType } from '0type'
import { isString } from 'asura-eye'
import { fsp, fs, _path } from './pkg'
import { FileSystemSetting } from './type'

export async function getJSONFileData(url: string): Promise<ObjectType> {
  if (!url) return {}
  try {
    const str = (await fsp.readFile(url)).toString()
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}
const getPaths = (url: any): string[] => {
  if (!isString(url)) return url
  return url?.replace(/\\\\|\//gi, '\\\\')?.trim().split(',').filter(Boolean).map(_=>_.trim()) || []
}

const match = (list: string[], currentPath: string): boolean => {
  if (!list?.length) return false
  for (let i = 0; i < list.length; i++) {
    const item: string = list[i]
    if (currentPath.includes(item)) {
      return true
    }
  }
  return false
}

export const readCurrentDir = async (payload: any) => {
  const { path, setting = {} } = payload

  const { includeDir, excludeDir, includeFile, excludeFile } =
    setting as FileSystemSetting
  const includeDirs = getPaths(includeDir)
  const excludeDirs = getPaths(excludeDir)
  const includeFiles = getPaths(includeFile)
  const excludeFiles = getPaths(excludeFile)

  if (!isString(path)) return []
  try {
    // 读取目录项，带类型信息
    const entries = await fsp.readdir(path, { withFileTypes: true })

    const res: any[] = []
    for (const ent of entries) {
      const currentPath = _path.join(path, ent.name)
      const item = {
        ...ent,
        path: currentPath,
        type: 'file',
      }
      // console.log(
      //   item.name,
      //   excludeDirs,
      //   currentPath,
      //   includeDirs?.length,
      //   match(excludeDirs, currentPath),
      // )

      if (ent.isDirectory()) {
        item.type = 'dir'
        //  includeDir
        if (includeDirs?.length) {
          if (match(includeDirs, currentPath)) res.push(item)
          continue
        }
        // excludeDir
        if (excludeDirs?.length) {
          if (match(excludeDirs, currentPath)) continue
        }
      } else {
        // includeFile
        if (includeFiles?.length) {
          if (match(includeFiles, currentPath)) res.push(item)
          continue
        }
        // excludeFile
        if (excludeFiles?.length) {
          if (match(excludeFiles, currentPath)) continue
        }
      }
      res.push(item)
    }
    // console.log(res.map(_=>_.name), excludeDirs, currentPath)
    return res
  } catch (err) {
    console.error('读取目录失败:', err)
    return []
  }
}

export const readFile = async (payload: any) => {
  const { path } = payload
  if (!isString(path)) return
  return new Promise((rs) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
        console.log('readFile ~ error:', error)
        return rs(-1)
      }
      // console.log(data)
      rs(data)
    })
  })
}
