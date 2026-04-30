import { ObjectType } from '0type'

export type Task = {
  id?: string
  name?: string
  group?: string
  exec(): Promise<any>
  [key: string]: any

   /**
   * @default 'idle'
   */
  status?: 'success' | 'warning' | 'error' | 'running' | 'idle'
  startTime?: number
  endTime?: number
  errorMsg?: string
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
