import { path, fs, _path } from './pkg'
import { FS_Payload } from './type'

/**
 * 路径不存在则创建（核心函数）
 * @param {Object} payload
 */
export async function createPathIfNotExist(payload: FS_Payload) {
  const { isFile } = payload
  //  * @param {string} targetPath - 目标路径（目录/文件路径均可）
  const targetPath = payload.path
  //  * @param {boolean} isFilePath - 是否为文件路径（默认 false，即目录路径）
  const isFilePath = isFile || false
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
