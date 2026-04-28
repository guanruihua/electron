export * from './conf'
export * from './type'

import { isString } from 'asura-eye'
import { FileNode, PageState } from './type'

export const getData = async (
  type: 'dir' | 'driver',
  payload: any = '',
  setting: PageState['setting'] = {},
) => {
  if (type === 'dir') {
    if (!isString(payload)) return []
    const path: string = payload
    const values =
      (await window.api.invoke('fs', {
        action: 'readCurrentDir',
        payload: {
          setting,
          path: path.endsWith('\\') ? path : path + '\\',
        },
      })) || []

    return (
      values
        .filter((_: any) => Boolean(_?.name))
        .map((item: any) => {
          item.sortBy = item.name.charCodeAt(0)
          item.fileType = getFileType(item)
          if (item.type === 'dir') item.sortBy += 660_000
          // if (item.type === 'file') item.sortBy -= 661000
          if (item.fileType === 'image') item.sortBy += 1000
          return item
        })
        .sort((a: any, b: any) => b.sortBy - a.sortBy) || []
    )
  }
  if (type === 'driver') {
    const res = await window.api.invoke('cmd', 'wmic logicaldisk get name')
    return res
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^[A-Za-z]:$/.test(line))
    // .map((line) => line + '\\')
  }
  // const res = await window.api.invoke('getFileTree', { path: 'D:\\' })
}

const ImageType = 'jpg, jpeg, png, gif, bmp, ico, webp, avif, svg'
  .split(',')
  .map((_) => _.trim())

export const getFileType = (item: FileNode) => {
  const { name } = item
  if (!isString(name)) return 'file'
  if (item.type === 'dir') return 'dir'

  if (['.txt'].some((v) => name.endsWith(v))) return 'txt'
  if (['.md', '.mdx'].some((v) => name.endsWith(v))) return 'md'
  if (ImageType.some((v) => name.endsWith(v))) return 'image'
  if (['.mp3'].some((v) => name.endsWith(v))) return 'music'
  if (['.svg'].some((v) => name.endsWith(v))) return 'svg'
  if (['.zip', '.7z', '.rar'].some((v) => name.endsWith(v))) return 'zip'
  if (['.ts'].some((v) => name.endsWith(v))) return 'ts'
  if (['.js', '.cjs', '.mjs'].some((v) => name.endsWith(v))) return 'js'
  if (['.json', '.jsonc'].some((v) => name.endsWith(v))) return 'json'
  if (['.html', 'htm'].some((v) => name.endsWith(v))) return 'html'
  if (['.css'].some((v) => name.endsWith(v))) return 'css'
  if (['.lnk'].some((v) => name.endsWith(v))) return 'lnk'
  if (['.exe'].some((v) => name.endsWith(v))) return 'exe'
  return 'file'
}
