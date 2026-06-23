import axios from 'axios'
import fs from 'fs'
import { FS_Payload } from './type'
import { isString } from 'asura-eye'
import { _path } from './pkg'

export async function saveUrlImg2File(payload: FS_Payload) {
  try {
    const { url, path, cover = false } = payload
    if (!isString(url) || !isString(path)) return
    const dir = _path.dirname(path)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    if (cover && fs.existsSync(path)) {
      fs.unlinkSync(path)
    }

    const writer = fs.createWriteStream(path)
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream', // 关键：以流形式处理大文件不占内存
    })
    response.data.pipe(writer)

    return new Promise<number>((resolve, reject) => {
      writer.on('finish', () => resolve(1))
      writer.on('error', () => reject(-1))
      response.data.on('error', () => reject(-1))
    })
  } catch (error) {
    console.error(error)
    return -1
  }
}

// 使用示例
// downloadWithAxios('https://example.com/avatar.png', './avatar.png')
// .then(() => console.log('下载完成'));
