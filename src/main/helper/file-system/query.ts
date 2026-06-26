import { ObjectType } from '0type'
import { isNumber, isString } from 'asura-eye'
import { fsp, fs, _path } from './pkg'
import { FileSystemSetting, FS_Payload } from './type'
import { stat } from './check'
import { parseFile } from 'music-metadata'

export async function getJSONFileData(
  payload: FS_Payload,
): Promise<ObjectType> {
  const url = payload.path
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
  return (
    url
      ?.replace(/\\\\|\//gi, '\\\\')
      ?.trim()
      .split(',')
      .filter(Boolean)
      .map((_) => _.trim()) || []
  )
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

const setRelatedData = async (
  relatedData: string,
  currentPath: string,
  item: any,
) => {
  if (!isString(relatedData)) return
  const list = relatedData.split(',').map((_) => _.trim())

  const fileStat = await stat({ path: currentPath })

  for (const type of list) {
    if (type === 'stat') {
      item.stat = fileStat
      continue
    }
    if (type === 'music-metadata') {
      const ext = currentPath.split('.').at(-1)
      if (!ext || !['mp3', 'flac', 'wav', 'm4a', 'ogg', 'wma'].includes(ext))
        continue
      try {
        const metadata = await parseFile(currentPath)
        const data = {
          duration: metadata?.format?.duration,
          bitrate: metadata?.format?.bitrate,
        }
        if (
          !data.duration &&
          isNumber(data.bitrate) &&
          isNumber(fileStat?.size)
        ) {
          data.duration = Math.floor((fileStat.size * 8) / data.bitrate) + 1
        }

        // item['music_metadata'] = metadata
        item['music_metadata'] = data
        // console.log(data, metadata.common)
      } catch (error) {
        console.error(error)
      }
      continue
    }
  }
  // console.log(item)
}

export const readCurrentDir = async (payload: FS_Payload) => {
  const { path, setting = {} } = payload
  console.log(`[readCurrentDir] `, payload)

  const { includeDir, excludeDir, includeFile, excludeFile, relatedData } =
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
      const item: any = {
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
          if (match(includeFiles, currentPath)) {
            await setRelatedData(relatedData, currentPath, item)
            res.push(item)
          }
          continue
        }
        // excludeFile
        if (excludeFiles?.length) {
          if (match(excludeFiles, currentPath)) continue
        }
      }
      await setRelatedData(relatedData, currentPath, item)
      res.push(item)
    }
    // console.log(res.map(_=>_.name), excludeDirs, currentPath)
    // console.log(res)
    return res
  } catch (err) {
    console.error('读取目录失败:', err)
    return []
  }
}

export const readFile = async (payload: FS_Payload) => {
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
