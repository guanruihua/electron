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
  hty_options?: {
    value: string
  }[]
  tree?: FileTreeType
  simpleTree?: FileTreeType
}
