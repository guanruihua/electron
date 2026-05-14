import { ObjectType } from '0type'

export interface DataSchema {
  id: string
  createTime?: number
  updateTime?: number
  [key: string]: any
}

export type DBAction =
  | 'init'
  | 'add'
  | 'find'
  | 'update'
  | 'delete'
  | 'count'
  | 'clear'

  export type ResultType =
  | `db:${DBAction}`
  | 'error:empty-action'
  | 'error:no-mapping-action'
  | 'error:unknown'

export type Result = {
  error?: true
  type: ResultType
  message?: string
  data?: any
  [key: string]: any
}

// 数据库根结构
export type DatabaseSchema = ObjectType<DataSchema[]>
