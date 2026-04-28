import { isString } from 'asura-eye'
import { getData, PageState } from './index'

export const getPathMap = async (
  path: string,
  pageState: PageState,
): Promise<PageState['pathMap']> => {
  if (!pageState?.setting) return pageState?.pathMap || {}
  const values = await getData('dir', path, pageState.setting)
  const pathMap = {
    ...pageState.pathMap,
  }
  pathMap[path] = values
  return pathMap
}

export const getHeaderPaths = (path: string): PageState['headerPaths'] => {
  if (!isString(path)) return
  const list = path.split('\\') || []

  return list
    .map((value, i) => {
      return {
        value,
        dataKey: list.slice(0, i).join('\\'),
      }
    })
    .concat({
      value: '',
      dataKey: path,
    })
}
