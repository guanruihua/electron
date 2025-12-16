import path from 'path'
import _fs from 'fs'
import { ObjectType } from '0type'
const fs = _fs.promises

export async function deleteFile(url: string) : Promise<boolean>{
  if(!url) return false
    try {
    await fs.unlink(url)
    console.log('Handle Delete File Success')
    return true
  } catch (error) {
    console.log('Handle Delete File Error')
    return false
  }
}

export async function saveJSON2File(
  url: string,
  value: ObjectType | any[],
): Promise<boolean> {
  if (!url) return false
  try {
    await ensureExists(url)
    await fs.writeFile(url, JSON.stringify(value))
    console.log('Handle saveJSON2File Success')
    return true
  } catch (error) {
    console.log('Handle saveJSON2File Error')
    return false
  }
}

export async function getJSONFileData(url: string): Promise<ObjectType> {
  if (!url) return {}
  try {
    const str = (await fs.readFile(url)).toString()
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}

export async function ensureExists(url: string, defaultData: string = '') {
  if (!url) return
  // console.log(url)
  try {
    await fs.access(url)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // 创建目录
      const dir = path.dirname(url)
      await fs.mkdir(dir, { recursive: true })

      // 创建文件
      await fs.writeFile(url, defaultData, 'utf8')
      console.log(`Create FIle/Dir: ${url}`)
    } else {
      console.error(error)
    }
  }
}
