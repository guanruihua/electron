import { isObject } from 'asura-eye'
import { clipboard, nativeImage } from 'electron'

export const copy = async (_, payload: any) => {
  if (!isObject(payload)) return false
  const { data } = payload
  try {
    if (typeof data === 'string') {
      clipboard.writeText(data)
      return true
    } else if (data && data.path) {
      const image = nativeImage.createFromPath(data.path)
      clipboard.writeImage(image)
      return true
    } else if (Buffer.isBuffer(data)) {
      const image = nativeImage.createFromBuffer(data)
      clipboard.writeImage(image)
      return true
    } else if (data && data.base64) {
      const image = nativeImage.createFromDataURL(data.base64)
      clipboard.writeImage(image)
      return true
    } else {
      console.warn('不支持的数据类型')
      return false
    }
  } catch (err) {
    console.error('写入剪贴板失败:', err)
    return false
  }
}
