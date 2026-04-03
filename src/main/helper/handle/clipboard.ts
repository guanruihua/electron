import { isObject } from 'asura-eye'
import { clipboard, nativeImage } from 'electron'

export const copy = async (_, payload: any) => {
  if (!isObject(payload)) return false
  const { data, path, base64 } = payload
  try {
    if (base64) {
      const image = nativeImage.createFromDataURL(base64)
      clipboard.writeImage(image)
      return true
    }
    if (path) {
      const image = nativeImage.createFromPath(path)
      clipboard.writeImage(image)
      return true
    }
    if (Buffer.isBuffer(data)) {
      const image = nativeImage.createFromBuffer(data)
      clipboard.writeImage(image)
      return true
    }
    if (typeof data === 'string') {
      clipboard.writeText(data)
      return true
    }
    console.warn('不支持的数据类型')
    return false
  } catch (err) {
    console.error('写入剪贴板失败:', err)
    return false
  }
}
