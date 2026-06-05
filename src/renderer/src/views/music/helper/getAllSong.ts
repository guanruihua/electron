import { isString } from 'asura-eye'
import { Song } from '../type'

export const getAllSong = async () => {
  const res = await window.api.fs('readCurrentDir', {
    path: 'D:\\Music',
    setting: {
      relatedData: 'stat,music-metadata',
      // relatedData: 'stat'
      // relatedData: 'music-metadata'
    },
  })
  /**
   * 音乐: .ogg,
   * 歌词: .lrc
   */
  const list: Song[] = []
  res.forEach((item) => {
    const { name, path } = item
    const ext = path.split('.').at(-1)
    if (!ext || !['mp3', 'flac', 'wav', 'm4a', 'ogg', 'wma'].includes(ext))
      return
    if (!isString(name)) return
    const tmp = name.split('.')

    const song: Song = {
      ...item,
      uid: path,
      name: tmp.slice(0, tmp.length-1).join('.'),
    }
    list.push(song)
  })
  // console.log(list.slice(0, 10))
  return list
}
