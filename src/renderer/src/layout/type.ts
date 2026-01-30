export interface ViewState {
  id: string
  url?: string
  search?: string
  title?: string
  canGoBack?: boolean
  canGoForward?: boolean
  [key: string]: any
}

export interface ViewStates {
  [key: string]: ViewState
}

export interface PageState {
  activeTab?: string
  tabs?: string[]
  [key: string]: any
}

export interface ViewProps {
  state: PageState
  info: ViewStates
  handle: {
    setState(newState: Partial<PageState>): void
    [key: string]: any
  }
  id: string
}
