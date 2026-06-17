import { FileTreeType } from '@/type'

export type PageState = Partial<{
  detail: boolean
  commitMsg: string
  repoStatus: Partial<{
    M: number
    D: number
    A: number
  }>
  hty: {
    hash: string
    username: string
    email: string
    time: string
    commit: string
  }[]
  hty_options: {
    value: string
  }[]
  tree: FileTreeType
  simpleTree: FileTreeType
}>
