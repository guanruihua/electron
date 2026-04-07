import { isArray, isObject, isString } from 'asura-eye'
import fs from 'fs'
import path from 'path'
import fsp from 'fs/promises'
const _path = path
/**
 * 路径不存在则创建（核心函数）
 * @param {Object} payload
 */
async function createPathIfNotExist(payload: any) {
  if (!payload?.path) return
  //  * @param {string} targetPath - 目标路径（目录/文件路径均可）
  const targetPath = payload.path
  //  * @param {boolean} isFilePath - 是否为文件路径（默认 false，即目录路径）
  const isFilePath = payload.isFile || false
  return new Promise((rs) => {
    try {
      // 如果是文件路径，先提取其所在目录
      const finalPath = isFilePath ? path.dirname(targetPath) : targetPath
      // 核心：recursive: true 自动创建多级目录，路径存在时无副作用
      fs.mkdir(finalPath, { recursive: true }, (error) => {
        if (error) {
          rs(-1)
          return console.error(error)
        }
        // console.log(
        //   `Path (${finalPath}) It has been confirmed that it exists (if it did not exist, it has been created)`,
        // )
        rs(1)
      })
    } catch (err) {
      console.error(`Create Path (${targetPath}) Error`)
      console.error(err)
      rs(-1)
    }
  })
}

const checkPath = async (target: any) => {
  // console.log(target)
  return target
}
const readFile = async (payload) => {
  const { path } = payload
  if (!isString(path)) return
  return new Promise((rs) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
        console.log('@ ~ readFile ~ error:', error)
        return rs(-1)
      }
      // console.log(data)
      rs(data)
    })
  })
}
const saveFile = async (payload) => {
  const { path, data, format = true } = payload
  const getDataStr = () => {
    try {
      if (isString(data)) return data
      if (isObject(data) || isArray(data))
        return format ? JSON.stringify(data, null, 2) : JSON.stringify(data)
      return ''
    } catch {
      return ''
    }
  }
  const dataStr = getDataStr()
  if (!isString(path)) return
  return new Promise((rs) => {
    fs.writeFile(path, dataStr, 'utf8', (error) => {
      if (error) {
        console.log('@ ~ writeFile ~ error:', error)
        return rs(-1)
      }
      rs(1)
    })
  })
}

const readCurrentDir = async (payload: any) => {
  const { path } = payload

  if (!isString(path)) return []
  try {
    // 读取目录项，带类型信息
    const entries = await fsp.readdir(path, { withFileTypes: true })

    const res: any[] = []
    for (const ent of entries) {
      const item = {
        ...ent,
        path: _path.join(path, ent.name),
        type: 'file',
      }
      if (ent.isDirectory()) {
        item.type = 'dir'
      }
      res.push(item)
    }

    return res
  } catch (err) {
    console.error('读取目录失败:', err)
    return []
  }
}

const stat = async (payload: any) => {
  const { path } = payload

  if (!isString(path)) return
  return await fsp.stat(path)
}

export const FileSystem = async (target: any) => {
  const { action, payload } = target
  return {
    createPathIfNotExist,
    checkPath,
    readFile,
    saveFile,
    readCurrentDir,
    stat,
  }?.[action]?.(payload)
}
