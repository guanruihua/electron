import { isArray, isObject, isString } from 'asura-eye'
import { JSONFilePreset } from 'lowdb/node'
import type { DataSchema, DatabaseSchema, Result } from '../type'

type Params = {
  action?: string
  tableName?: string
  DBName?: string
  payload?: Partial<
    DataSchema & {
      path: string
      defaultValue: DatabaseSchema
    }
  >
}

export class LowDB {
  private MAP: {
    db: any
    [key: string]: any
  } = {
    db: null,
  }

  async init(params: Params): Promise<boolean | Result> {
    const { payload, DBName = 'db' } = params
    const { path = 'D:\\Data\\electron', defaultValue = {} } = payload || {}

    if (!isString(DBName)) return false
    this.MAP[DBName] = await JSONFilePreset<DatabaseSchema>(
      `${path}\\lowdb\\${DBName}.json`,
      defaultValue,
    )
    return true
  }

  // 创建
  async add(params: Params): Promise<DataSchema | false> {
    const { payload, tableName, DBName = 'db' } = params
    if (!isString(tableName) || !isString(DBName)) return false

    const now = Date.now()
    const item: DataSchema = {
      id: now.toString(),
      createTime: now,
      updateTime: now,
      ...payload,
    }

    if (!this.MAP[DBName]) return false

    if (isArray(this.MAP[DBName].data[tableName])) {
      this.MAP[DBName].data[tableName].push(item)
    } else {
      this.MAP[DBName].data[tableName] = [item]
    }
    await this.MAP[DBName].write()

    return item
  }

  // 条件查询
  find(params: Params): DataSchema[] {
    const { payload, tableName, DBName = 'db' } = params

    if (!isString(tableName) || !isString(DBName) || !this.MAP[DBName])
      return []

    const getList = (data: any[]) => {
      if (!isArray(data)) return []
      if (!isObject(payload)) return data
      return data.filter((item) => {
        for (const key in payload) {
          if (item[key] !== payload[key]) return false
        }
        return true
      })
    }

    return getList(this.MAP?.[DBName].data?.[tableName])
  }

  // 根据 ID 更新
  async update(params: Params) {
    const { payload, tableName, DBName = 'db' } = params

    if (!isString(DBName) || !isString(tableName) || !isObject(payload))
      return false
    const { id } = payload
    if (!id) return false

    if (!isArray(this.MAP[DBName].data?.[tableName])) return false

    const index = this.MAP[DBName].data[tableName].findIndex((_) => _.id === id)
    if (index === -1) return false

    this.MAP[DBName].data[tableName][index] = {
      ...this.MAP[DBName].data[tableName][index],
      ...payload,
      updateTime: Date.now(),
    }
    await this.MAP[DBName].write()

    return true
  }

  // 根据payload删除
  async delete(params: Params) {
    const { payload, tableName, DBName = 'db' } = params
    if (!isString(DBName) || !isString(tableName) || !isObject(payload))
      return false

    if (
      !isArray(this.MAP[DBName]?.data?.[tableName]) ||
      this.MAP[DBName].data[tableName].length === 0
    )
      return false

    const list = this.MAP[DBName].data[tableName]
    const beforeLen = list.length

    this.MAP[DBName].data[tableName] = list.filter((item) => {
      if (item.id === payload.id) return false
      return true
    })

    if (this.MAP[DBName].data[tableName].length === beforeLen) return false

    await this.MAP[DBName].write()

    return true
  }

  // 总数
  count(params: Params): number {
    const { payload, tableName, DBName = 'db' } = params
    if (!isString(DBName) || !isString(tableName)) return 0

    const list = this.MAP?.[DBName].data?.[tableName]
    if (!isArray(list)) return 0
    if (isObject(payload)) return this.find(params)?.length || 0
    return list.length
  }

  // 清空
  async clear(params: Params): Promise<boolean> {
    const { tableName, DBName = 'db' } = params
    if (!isString(DBName) || !isString(tableName)) return false

    if (!isArray(this.MAP?.[DBName]?.data?.[tableName])) return false
    
    this.MAP[DBName].data[tableName] = []
    await this.MAP[DBName].write()
    return true
  }
}

export const lowdb = new LowDB()
