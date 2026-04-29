export * from './TRM'
export * from './file'

import React from 'react'
import { ObjectType } from '0type'
import { SetLoadings } from '@/util'

export type Weather = {
  code: number
  timeName: string
  weather: string
  date: string
  min: number
  max: number
  /**
   * @description 降雨量
   */
  mm: number
}

export interface ViewState {
  id?: string
  url?: string
  search?: string
  title?: string
  canGoBack?: boolean
  canGoForward?: boolean
  [key: string]: any
}

export type ViewStates = ViewState[]

export type ProjectConf = Partial<{
  label: string
  path: string
  type: 'group' | string
  npm: string
  web: string
  git: boolean
  build: Partial<{
    frontend: string
    backend: string
    [key: string]: any
  }>
  children: ProjectConf[]
  [key: string]: any
}>

export interface State {
  initSuccess?: boolean

  activeTab?: string

  [key: string]: any
}

export interface Handle {
  success(msg: string, ...rest: any[]): void
  error(msg: string, ...rest: any[]): void
  renderState(): void
  setState(newState: Partial<State>): void
  setLoadings: SetLoadings
  setDefaultState(state: State): state is Required<State>
  [key: string]: any
}

export interface Hook {
  state: State
  handle: Handle
  loadings?: ObjectType<boolean>
  [key: string]: any
}

export interface ViewProps {
  h: Hook
  tab: ViewState
}

export interface ModuleProps {
  h: Hook
  children?: React.ReactNode
  [key: string]: any
}

export type SysState = {
  initSuccess: boolean
  path: string
  ignoreApps: string
  selectedQuickStart: number
  quickStarts: string[][]
  selectProject: ProjectConf

  NodeTreads: ObjectType[]
  apps: [string, string][]
  modules: ProjectConf[]
  [key: string]: any
}

export type Task = {
  /**
   * @default 'idle'
   */
  status?: 'success' | 'warning' | 'error' | 'running' | 'idle'
  startTime?: number
  endTime?: number
  desc?: string
  cmd?: string
  name?: string
  id?: string
  group?: string
  errorMsg?: string
  exec(): Promise<any>
  [key: string]: any
}

export type TaskState = {
  initSuccess: boolean
  loadings: {
    nodeThread?: boolean
    project?: boolean
    projectOpt?: boolean
  } & ObjectType<boolean>
  loadingsGroup: {
    nodeThread?: number
    project?: number
    projectOpt?: number
  } & ObjectType<number>
  tasks: Task[]
  taskIndex: number
}
