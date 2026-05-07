import { ObjectType } from '0type'

export type Task = {
  id?: string
  name?: string
  group?: string
  desc?: string
  exec(): Promise<any>

  type?: 'running' | 'stop'
  uid?: string
  /**
   * @default 'idle'
   */
  status?: 'success' | 'warning' | 'error' | 'running' | 'idle'
  startTime?: number
  endTime?: number
  execMsg?: string
  errorMsg?: string

  [key: string]: any
}

export type TaskState = {
  initSuccess: boolean
  running: boolean
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
