import { isArray, isObject, isString } from 'asura-eye'
import { JSONFilePreset } from 'lowdb/node'
import type { DataSchema, DatabaseSchema, Result } from '../type'
import { createDirIfNotExist } from '../helper/file-system/check'
import { saveFile } from '../helper/file-system/save'
import { deleteFile } from '../helper/file-system/del'
import { isChange, isEmptyRecord } from '../util'

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
  private ImagePathMAP: {
    [key: string]: string
  } = {}

  async init(params: Params): Promise<boolean | Result> {
    const { payload, DBName = 'db' } = params
    const { path = 'D:\\Data\\electron', defaultValue = {} } = payload || {}

    if (!isString(DBName)) return false
    this.MAP[DBName] = await JSONFilePreset<DatabaseSchema>(
      `${path}\\lowdb\\${DBName}.json`,
      defaultValue,
    )
    createDirIfNotExist(`${path}\\lowdb\\image\\${DBName}`)
    this.ImagePathMAP[DBName] = `${path}\\lowdb\\image\\${DBName}`
    return true
  }

  async getItem(params: Params): Promise<DataSchema> {
    const { payload, DBName = 'db' } = params
    const now = Date.now()

    const imagePath = this.ImagePathMAP[DBName]

    if (payload?.type === 'image' && payload.data && imagePath) {
      const { type, data, ...payload2 } = payload
      const path = `${imagePath}\\${now}.png`

      await saveFile({
        data,
        path,
      })

      return {
        id: now.toString(),
        createTime: now,
        updateTime: now,
        type,
        data: path,
        path,
        ...payload2,
      }
    }

    return {
      id: now.toString(),
      createTime: now,
      updateTime: now,
      ...payload,
    }
  }

  // 创建
  async add(params: Params): Promise<DataSchema | false> {
    const { tableName, DBName = 'db' } = params
    if (!isString(tableName) || !isString(DBName) || !this.MAP[DBName])
      return false

    const item: DataSchema = await this.getItem(params)

    if (!isArray(this.MAP[DBName].data?.[tableName])) {
      this.MAP[DBName].data[tableName] = []
    }
    this.MAP[DBName].data[tableName].push(item)

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
          if (isChange(item[key], payload[key])) return false
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

    // if (!this.MAP[DBName]) return false

    const { id, uid } = payload
    if ((!id && !uid) || !isArray(this.MAP?.[DBName]?.data?.[tableName]))
      return await this.add(params)

    const index = this.MAP[DBName].data[tableName].findIndex(
      (_) => _.id === id || _.uid === uid,
    )
    if (index === -1) return await this.add(params)

    this.MAP[DBName].data[tableName][index] = await this.getItem({
      ...params,
      payload: {
        ...this.MAP[DBName].data[tableName][index],
        ...payload,
        updateTime: Date.now(),
      },
    })

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

    let imagePath: null | string = null
    this.MAP[DBName].data[tableName] = list.filter((item) => {
      if (item.type === 'image' && item.path) imagePath = item.path
      if (item.id === payload.id) return false
      return true
    })
    imagePath && (await deleteFile({ path: imagePath }))
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
  // 清除空数据
  async clearEmptyRecord(params: Params): Promise<boolean> {
    const { tableName, DBName = 'db' } = params
    if (!isString(DBName) || !isString(tableName)) return false

    const list = this.MAP?.[DBName]?.data?.[tableName]
    if (!isArray(list)) return false

    this.MAP[DBName].data[tableName] = list.filter((item) => {
      const keys = Object.keys(item).filter(
        (key) => !['id', 'uid', 'createTime', 'updateTime'].includes(key),
      )
      if (keys.length === 0) return false
      for (const key of keys) {
        const val = item[key]
        if (!isEmptyRecord(val)) {
          return true
        }
      }
      return false
    })
    await this.MAP[DBName].write()

    console.log(
      `lowdb/clearEmptyRecord DBName:${DBName} TableName:${tableName}`,
    )
    return true
  }
  // 清空
  async clear(params: Params): Promise<boolean> {
    const { tableName, DBName = 'db' } = params
    if (!isString(DBName) || !isString(tableName)) return false

    const list = this.MAP?.[DBName]?.data?.[tableName]
    if (!isArray(list)) return false

    for (let i = list.length - 1; i >= 0; i--) {
      const { type, path } = list[i]
      if (type === 'image' && path) {
        await deleteFile({ path })
      }
    }
    this.MAP[DBName].data[tableName] = []
    await this.MAP[DBName].write()

    console.log(`lowdb/clear DBName:${DBName} TableName:${tableName}`)
    return true
  }
}

export const lowdb = new LowDB()
