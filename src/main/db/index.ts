import { isObject, isString } from 'asura-eye'
import { lowdb } from './lowdb'
import { DBAction, Result, ResultType } from '../type'

export const db = async (_e, conf: any): Promise<Result> => {
  const { action } = conf
  if (!isString(action))
    return {
      error: true,
      type: 'error:empty-action',
    }
  if (lowdb[action]) {
    const result: Result = {
      type: `db:${action as DBAction}`,
    }
    try {
      const data = await lowdb[action](conf)
      if (isObject(data) && data.error) {
        result.error = true
        if (isString(data.type)) result.type = data.type as ResultType
        if (Object.keys(data).includes('data')) result.data = data.data
      } else {
        result.data = data
      }
    } catch (error) {
      result.error = true
    }
    return result
  }
  return {
    type: 'error:no-mapping-action',
    error: true,
  }
}
