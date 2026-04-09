import { isString } from 'asura-eye'
import { fsp, _path } from './pkg'

export async function ensureExists(
  url: string,
  defaultData: string = '',
): Promise<boolean> {
  if (!isString(url) || !url) return false
  try {
    await fsp.access(url)
    return true
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // 创建目录
      const dir = _path.dirname(url)
      await fsp.mkdir(dir, { recursive: true })

      // 创建文件
      await fsp.writeFile(url, defaultData, 'utf8')
      console.log(`Create FIle/Dir: ${url}`)
      return true
    } else {
      console.error(error)
      return false
    }
  }
}

export const stat = async (payload: any) => {
  const { path } = payload

  if (!isString(path)) return
  return await fsp.stat(path)
}
