import { isString } from 'asura-eye'
import { PageState } from './type'
import { getFileTree, simplifyFileTree } from '@/util'

export const getHty = async (path?: string): Promise<PageState['hty']> => {
  if (!isString(path)) return []
  const history = await window.api.invoke(
    'cmdResult',
    // `cd ${path} && git log && exit`,
    `cd ${path} && git log --pretty=format:"%H|%an|%ae|%ad|%s" && exit`,
  )
  if (!isString(history)) return []
  return (
    history.split('\n').map((_) => {
      const [hash, username, email, time, ...commit] = _.split('|')
      return {
        hash,
        username,
        email,
        time,
        commit: commit.join(''),
      }
    }) || []
  )
}

export const gitPull = async (path?: string): Promise<PageState> => {
  if (!isString(path)) return {}
  const res = await window.api.invoke(
    'cmdResult',
    `cd ${path} && git status --porcelain=v1 -M1 && exit`,
  )
  // console.log('git status: ', res)

  if (!isString(res))
    return {
      tree: [],
      simpleTree: [],
    }

  const fileTree = getFileTree(res) || []
  return {
    tree: fileTree || [],
    simpleTree: simplifyFileTree(fileTree) || [],
  }
}

export const gitPush = async (
  path?: string,
  commitMsg: string = 'feat: Improve the documentation',
): Promise<boolean> => {
  if (!path) return false
  const res = await window.api.invoke(
    'cmd',
    'cd ' + path + ' && git pull && exit',
  )

  if (res) {
    await window.api.invoke(
      'cmd',
      `cd ${path} && git add . && git commit -m "${commitMsg}" && git push && exit`,
    )
    return true
  }
  return false
}
