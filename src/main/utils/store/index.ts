/* eslint-disable*/
import { ObjectType } from '0type'



const handleAdd = async (payload: ObjectType) => {
  const data = {}
  return { message: 'Handle Data Success', data, code: 200 }
}
const handleDel = async (payload: ObjectType) => {
  const data = {}
  return { message: 'Handle Data Success', data, code: 200 }
}
const handleSave = async (payload: ObjectType) => {
  const data = {}
  return { message: 'Handle Data Success', data, code: 200 }
}
const handleGet = async (payload: ObjectType) => {
  const data = {}
  return { message: 'Handle Data Success', data, code: 200 }
}

export const handleStore = async (conf: ObjectType = {}) => {
  const { type = 'get', payload = {} } = conf
  console.log('🚀 ~ handleStore ~ conf:', conf)
  switch (type) {
    case 'add':
      return await handleAdd(payload)
    case 'del':
    case 'delete':
      return await handleDel(payload)
    case 'edit':
    case 'save':
      return await handleSave(payload)
    case 'get':
      return await handleGet(payload)
  }
  return { message: 'Handle Store Error', data: undefined, code: 500 }
}
