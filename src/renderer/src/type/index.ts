export * from './TRM'
export * from './file'

import React from 'react'
import { ObjectType } from '0type'
import { SetLoadings } from '@/util'

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
  initSysSettingSuccess?: boolean
  initUserSettingSuccess?: boolean
  initSuccess?: boolean

  activeTab?: string
  tabs?: ViewState[]
  NodeTreads?: ObjectType[]
  apps?: [string, string][]
  modules?: ProjectConf[]
  sysSetting?: {
    path?: string
    [key: string]: any
  }
  setting?: Partial<{
    ignoreApps: string
    selectedQuickStart: number
    quickStarts: string[][]
    selectProject: ProjectConf
    [key: string]: any
  }>
  [key: string]: any
}

export interface Handle {
  success(msg: string, ...rest: any[]): void
  error(msg: string, ...rest: any[]): void
  renderState(): void
  setState(newState: Partial<State>): void
  saveToFile(type: 'setting' | 'modules' | 'apps'): void
  setLoadings: SetLoadings
  setDefaultState(state: State): state is Required<State>
  findAll_NodeThread(render?: boolean): Promise<void>
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

