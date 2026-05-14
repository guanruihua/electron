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
  | 'delete'
  | 'clear'
  | 'update'
  | 'count'

export type ResultType =
  | `db:${DBAction}`
  | 'error:empty-action'
  | 'error:no-mapping-action'
  | 'error:unknown'

export type Result<T = any> = {
  error?: true
  type: ResultType
  message?: string
  data?: T
  [key: string]: any
}

// 数据库根结构
export type DatabaseSchema = ObjectType<DataSchema[]>

export type DBTarget = {
  action: DBAction
  tableName?: String
  DBName?: String
  payload?: Partial<DataSchema>
  [key: string]: any
}
