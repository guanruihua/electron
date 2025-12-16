import path from 'path'
import {
  deleteFile,
  ensureExists,
  getJSONFileData,
  saveJSON2File,
} from './utils'
import { isEffectArray, isEffectObject } from 'asura-eye'
import type { StoreInfo, StorePayload } from './type'
import { ObjectType } from '0type'
const _path = path

export class StoreManager {
  StorePath = ''
  INFO: StoreInfo[] = [
    { name: 'setting', filename: 'setting.json', path: '', dataType: 'object' },
    { name: 'log', filename: 'log.json', path: '', dataType: 'array' },
    { name: 'data', filename: 'data.json', path: '', dataType: 'array' },
    {
      name: 'startMenu',
      filename: 'startMenu.json',
      path: '',
      dataType: 'array',
    },
    {
      name: 'fastStart',
      filename: 'fastStart.json',
      path: '',
      dataType: 'array',
    },
  ]
  CACHE: ObjectType<ObjectType | ObjectType[]> = {
    setting: {},
    log: [],
    startMenu: [],
    data: [],
  }

  constructor() {
    const rootDir = 'D:\\Data\\electron'
    this.StorePath = path.join(rootDir, 'data')
    Promise.all([
      //
      ensureExists(rootDir),
      ensureExists(this.StorePath),
    ]).then(() => {
      this.init()
    })
  }

  async initItem(item: StoreInfo) {
    try {
      if (item?.dataType === 'object') {
        ensureExists(item.path, '{}')
        this.CACHE[item.name] = (await getJSONFileData(item.path)) || {}
      } else {
        ensureExists(item.path, '[]')
        this.CACHE[item.name] = (await getJSONFileData(item.path)) || []
      }
      console.log(`Store '${item.name}' Init Success`)
    } catch (error) {
      console.error(`Store '${item.name}' Init Error:`, error)
    }
  }

  async init() {
    for (let i = 0; i < this.INFO.length; i++) {
      const item = this.INFO[i]
      item.path = path.join(this.StorePath, item.filename)
      this.initItem(item)
    }
  }

  handleStore = async (_e: any, conf: StorePayload = {}) => {
    const { type = 'get', payload = {}, dataType, filename } = conf
    const [handleType, storeName = 'data'] = type.split('/')

    if (!storeName) return { message: 'Handle Store Error', code: 500 }
    let storeInfo: StoreInfo | undefined = this.INFO.find(
      (_) => _.name === storeName,
    )

    if (!storeInfo) {
      console.warn('Not Find Store')
      console.log(`Start Create ${storeName} Store`)
      storeInfo = {
        name: storeName,
        filename: filename || storeName + '.json',
        path: _path.join(this.StorePath, filename || storeName + '.json'),
        dataType: dataType || 'array',
      }
      this.CACHE[storeInfo.name] = storeInfo.dataType === 'object' ? {} : []
      await saveJSON2File(
        storeInfo.path,
        storeInfo.dataType === 'object' ? {} : [],
      )
      this.INFO.push(storeInfo)
      // await this.initItem(storeInfo)
    }
    console.log(
      '🚀 ~ handleStore ~ conf:',
      handleType,
      storeInfo,
      JSON.stringify(payload).slice(0, 100) + '...',
    )
    try {
      switch (handleType) {
        case 'add':
          return await this.handleAdd(storeInfo, payload)
        case 'del':
        case 'delete':
          return await this.handleDel(storeInfo, payload)
        case 'edit':
        case 'save':
          return await this.handleSave(storeInfo, payload)
        case 'query':
        case 'get':
          return await this.handleGet(storeInfo, payload)
        case 'clear':
          return await this.handleClear(storeInfo, payload)
        case 'delStore':
        case 'deleteStore':
          return await this.handleDelStore(storeInfo, payload)
      }
    } catch (error) {
      console.log(error)
      return { message: 'Handle Store Error', code: 500 }
    }
    return { message: 'Handle Store Error', code: 500 }
  }

  handleAdd = async (storeInfo: StoreInfo, payload: StorePayload) => {
    const { name, dataType, path } = storeInfo
    if (dataType === 'array' && isEffectObject(payload)) {
      if (!payload.id) {
        payload.id = Date.now().toString()
      }
      this.CACHE[name].push(payload)
    }
    if (dataType === 'object' && isEffectObject(payload)) {
      for (const key in payload) {
        this.CACHE[name][key] = payload[key]
      }
    }
    await saveJSON2File(path, this.CACHE[name])
    return { message: 'Handle Add Data Success', code: 200 }
  }
  handleDel = async (storeInfo: StoreInfo, payload: StorePayload) => {
    const { name, dataType, path } = storeInfo
    if (dataType === 'array' && isEffectObject(payload)) {
      const { id, ids } = payload
      this.CACHE[name] = this.CACHE[name].filter((item) => {
        if (
          !item.id ||
          item.id === id ||
          (isEffectArray(ids) && ids.includes(item.id))
        )
          return false
        return true
      })
    }
    if (dataType === 'object' && isEffectObject(payload)) {
      const { id, ids } = payload
      const keys = Object.keys(this.CACHE[name])
      if (id && keys.includes(id)) {
        delete this.CACHE[name][id]
      }
      if (isEffectArray(ids)) {
        ids.forEach((id) => {
          if (id && keys.includes(id)) {
            delete this.CACHE[name][id]
          }
        })
      }
    }
    await saveJSON2File(path, this.CACHE[name])
    return { message: 'Handle Delete Data Success', code: 200 }
  }
  handleSave = async (storeInfo: StoreInfo, payload: StorePayload) => {
    const { name, dataType, path } = storeInfo
    if (dataType === 'array' && isEffectArray<StorePayload>(payload)) {
      payload.forEach((item, i) => {
        if (!item.id) item.id = i + '-' + Date.now().toString()
        this.CACHE[name].push(item)
      })
    }
    if (dataType === 'array' && isEffectObject(payload)) {
      const { id } = payload
      if (!id) {
        payload.id = Date.now().toString()
        this.CACHE[name].push(payload)
      } else {
        const index = this.CACHE[name].findIndex((_) => _.id === id)
        if (index)
          this.CACHE[name][index] = {
            ...this.CACHE[name][index],
            ...payload,
          }
      }
    }
    if (dataType === 'object' && isEffectObject(payload)) {
      for (const key in payload) {
        this.CACHE[name][key] = payload[key]
      }
    }
    await saveJSON2File(path, this.CACHE[name])
    await saveJSON2File(path, this.CACHE[name])
    return { message: 'Handle Save Data Success', code: 200 }
  }
  handleGet = async (storeInfo: StoreInfo, payload: StorePayload) => {
    const { name, dataType } = storeInfo
    const { id, ids } = payload

    const getData = () => {
      if (dataType === 'array') {
        if (ids) return this.CACHE[name].filter((_) => ids.includes(_.id))
        if (id) return this.CACHE[name].find((_) => _.id === id)
        return this.CACHE[name]
      }
      if (dataType === 'object') {
        if (ids) {
          const data = {}
          ids.forEach((id) => {
            data[id] = this.CACHE[name][id]
          })
          return data
        }
        if (id) return this.CACHE[name][id]

        return this.CACHE[name]
      }
    }
    const data: any = getData()

    return { message: 'Handle Get Data Success', data, code: 200 }
  }
  handleClear = async (storeInfo: StoreInfo, _payload: StorePayload) => {
    const { name, path, dataType } = storeInfo
    if (dataType === 'array') {
      this.CACHE[name] = []
    }
    if (dataType === 'object') {
      this.CACHE[name] = {}
    }
    await saveJSON2File(path, this.CACHE[name])

    return { message: 'Handle Clear Store Success', code: 200 }
  }
  handleDelStore = async (storeInfo: StoreInfo, _payload: StorePayload) => {
    const { name, path } = storeInfo
    delete this.CACHE[name]
    if (path) await deleteFile(path)
    return { message: 'Handle Delete Store Success', code: 200 }
  }
}
