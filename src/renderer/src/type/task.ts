import { ObjectType } from '0type'

export type Task = {
  id?: string
  uid?: string
  exec?(): Promise<any>
  cmd?: string 
  [key: string]: any
}

export type TaskState = {
  initSuccess: boolean
  running: boolean
  loadingCount: ObjectType<number>
  loadings: {
    nodeThread?: boolean
    project?: boolean
    projectOpt?: boolean
  } & ObjectType<boolean>
}
