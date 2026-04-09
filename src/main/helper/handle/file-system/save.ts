import { ObjectType } from '0type'
import { ensureExists } from './check'
import { fsp, fs, _path } from './pkg'
import { isArray, isObject, isString } from 'asura-eye'

export async function saveJSON2File(
  url: string,
  value: ObjectType | any[],
): Promise<boolean> {
  if (!url) return false
  try {
    await ensureExists(url)
    await fsp.writeFile(url, JSON.stringify(value))
    console.log('Handle saveJSON2File Success')
    return true
  } catch (error) {
    console.log('Handle saveJSON2File Error')
    return false
  }
}

export const saveFile = async (payload) => {
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
