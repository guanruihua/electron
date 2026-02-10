import { ObjectType } from '0type'

export interface ViewState {
  id?: string
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

export interface State {
  activeTab?: string
  tabs?: string[]
  NodeTreads?: ObjectType[]
  timeline?: {
    startTime: number
    info: ObjectType
    [key: string]: any
  }[]
  [key: string]: any
}

export interface Handle {
  addTimePoint(info: any): void
  setState(newState: Partial<State>): void
  NodeThread: {
    dev(item: ObjectType): Promise<void>
    stopAll(item: ObjectType): Promise<void>
    stop(item: ObjectType): Promise<void>
    findAll(item: ObjectType): Promise<void>
    [key: string]: any
  }
  [key: string]: any
}

export interface ViewProps {
  id: string
  state: State
  info: ViewStates
  handle: Handle
}
