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
