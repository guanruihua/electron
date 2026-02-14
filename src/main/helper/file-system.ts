import { isString } from 'asura-eye'
import fs from 'fs'
import path from 'path'

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
        console.log(
          `Path (${finalPath}) It has been confirmed that it exists (if it did not exist, it has been created)`,
        )
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
  console.log(target)
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
      console.log(data)
      rs(data)
    })
  })
}

export const FileSystem = async (target: any) => {
  const { action, payload } = target
  return {
    createPathIfNotExist,
    checkPath,
    readFile,
  }?.[action]?.(payload)
}
