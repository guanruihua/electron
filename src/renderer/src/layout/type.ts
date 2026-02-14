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
  setting?: {
    path: string
    [key: string]: any
  }
  [key: string]: any
}

export interface Handle {
  addTimePoint(info: any): void
  renderState(): void
  setState(newState: Partial<State>): void
  NodeThread: {
    dev(item: ObjectType, render?: boolean): Promise<void>
    stopAll(render?: boolean): Promise<void>
    /**
     * @description 停止模块运行
     * @param item
     * @param render
     */
    stopModule(item: ObjectType, render?: boolean): Promise<void>
    stop(item: ObjectType, render?: boolean): Promise<void>
    findAll(render?: boolean): Promise<void>
    [key: string]: any
  }
  [key: string]: any
}

export interface Hook {
  state: State
  info: ViewStates
  handle: Handle
  [key: string]: any
}

export interface ViewProps {
  id: string
  h: Hook
}

export interface ModuleProps {
  h: Hook
  [key: string]: any
}
export interface FileNode {
  // 文件夹/文件名
  name: string
  // 完整路径
  path: string
  // 是否为文件夹
  isDirectory: boolean
  // 子节点（文件夹才有）
  statusCode: string
  statusDesc: string
  children?: FileNode[]
}

export type FileTreeType = FileNode[]
