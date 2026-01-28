export interface PageState {
  url?: string
  search?: string
  title?: string
  canGoBack?: boolean
  canGoForward?: boolean

  activeTab?: string
  tabs?: string[]
  infos?: {
    [key: string]: {
      id: string
      title?: string
      url?: string
      [key: string]: any
    }
  }
  [key: string]: any
}
