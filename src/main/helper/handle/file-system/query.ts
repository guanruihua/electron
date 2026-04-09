import { ObjectType } from '0type'
import { isString } from 'asura-eye'
import { fsp, fs, _path } from './pkg'

export async function getJSONFileData(url: string): Promise<ObjectType> {
  if (!url) return {}
  try {
    const str = (await fsp.readFile(url)).toString()
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}

export const readCurrentDir = async (payload: any) => {
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

export const readFile = async (payload: any) => {
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
