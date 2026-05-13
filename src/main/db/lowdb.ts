import { isArray, isObject, isString } from 'asura-eye'
import { JSONFilePreset } from 'lowdb/node'
import type { DataSchema, DatabaseSchema } from '../type'
import { ObjectType } from '0type'

export class LowDB {
  private db: any = null

  async init(_, payload: ObjectType): Promise<boolean> {
    const { path = 'D:\\Data\\electron', defaultValue = {} } = payload
    this.db = await JSONFilePreset<DatabaseSchema>(
      path + '\\lowdb-db.json',
      defaultValue,
    )
    return true
  }

  // 创建
  async add(
    tableName: string,
    payload: Omit<DataSchema, 'id'>,
  ): Promise<DataSchema> {
    const now = Date.now()
    const item: DataSchema = {
      id: now.toString(),
      createTime: now,
      updateTime: now,
      ...payload,
    }
    if (isArray(this.db.data[tableName])) {
      this.db.data[tableName].push(item)
    } else {
      this.db.data[tableName] = [item]
    }
    await this.db.write()

    return item
  }

  // 条件查询
  find(tableName: string, payload?: Partial<DataSchema>): DataSchema[] {
    if (!isString(tableName)) return []
    if (!isObject(payload)) return this.db.data[tableName]
    return this.db.data[tableName].filter((item) => {
      for (const key in payload) {
        if (item[key] !== payload[key]) return false
      }
      return true
    })
  }

  // 查询全部
  findAll(): DatabaseSchema {
    return this.db.data
  }

  // 根据 ID 更新
  async update(tableName: string, payload: Partial<DataSchema>) {
    if (
      !isString(tableName) ||
      !isObject(payload) ||
      !isArray(this.db.data?.[tableName])
    )
      return false
    const { id } = payload
    if (!id) return false
    const index = this.db.data[tableName].findIndex((_) => _.id === id)
    if (index === -1) return false

    this.db.data[tableName][index] = {
      ...this.db.data[tableName][index],
      ...payload,
      updateTime: Date.now(),
    }
    await this.db.write()
    return true
  }

  // 根据payload删除
  async delete(tableName: string, payload: Partial<DataSchema>) {
    if (
      !isString(tableName) ||
      !isObject(payload) ||
      !isArray(this.db.data?.[tableName]) ||
      this.db.data[tableName].length === 0
    )
      return false
    const list = this.db.data[tableName]
    const beforeLen = list.length
    this.db.data[tableName] = list.filter((item) => {
      if (item.id === payload.id) return false
      // for (const key in payload) {
      //   if (item[key] === payload[key]) return false
      // }
      return true
    })

    if (this.db.data[tableName].length === beforeLen) return false

    await this.db.write()
    return true
  }

  // 总数
  count(tableName: string, payload?: Partial<DataSchema>): number {
    const list = this.db.data?.[tableName]
    if (!isString(tableName) || !isArray(list)) return 0
    if (isObject(payload)) return this.find(tableName, payload)?.length || 0
    return list.length
  }

  // 清空
  async clear(tableName: string): Promise<boolean> {
    const keys = Object.keys(this.db.data)
    if (!keys.includes(tableName)) return false
    this.db.data[tableName] = []
    await this.db.write()
    return true
  }
}

export const lowdb = new LowDB()
