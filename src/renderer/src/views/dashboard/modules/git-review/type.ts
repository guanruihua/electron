import { FileTreeType } from '@/type'

export interface PageState {
  commitMsg?: string
  hty?: {
    hash: string
    username: string
    email: string
    time: string
    commit: string
  }[]
  tree?: FileTreeType
  simpleTree?: FileTreeType
}
