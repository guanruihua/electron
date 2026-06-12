import { ensureExists } from './check'
import { fsp, fs, _path } from './pkg'
import { isArray, isObject, isString } from 'asura-eye'
import { FS_Payload } from './type'

export async function saveJSON2File(payload: FS_Payload): Promise<boolean> {
  const url = payload.path
  if (!url) return false
  const { data = '{}' } = payload
  try {
    await ensureExists({ path: url })
    await fsp.writeFile(url, isString(data) ? data : JSON.stringify(data))
    console.log('Handle saveJSON2File Success')
    return true
  } catch (error) {
    console.log('Handle saveJSON2File Error')
    return false
  }
}

export const saveFile = async (payload: FS_Payload) => {
  const { path, data, format = true } = payload
  const dir = _path.dirname(path)
  // 确保输出目录存在（可选）
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const getDataStr = () => {
    try {
      if (isString(data)) {
        if (data.slice(0, 22) === 'data:image/png;base64,') {
          // 将 Base64 转为 Buffer
          const imageBuffer = Buffer.from(data.slice(22), 'base64')
          // 4. 写入文件
          return imageBuffer
        }
        return data
      }
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
