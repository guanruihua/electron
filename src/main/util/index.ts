import { isArray, isObject } from 'asura-eye'
import { v4 as getUUID }  from 'uuid'

export {
  getUUID
}
/**
 * @title isChange
 * @description Comparison value
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean} true: change, false: no-change
 *
 */
export const isChange = (a: any, b: any) => {
  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return true
    if (a.length === 0) return false
    for (let i = 0; i < a.length; i++) if (isChange(a[i], b[i])) return true
    return false
  }

  if (isObject(a) && isObject(b)) {
    if (Object.keys(a).length !== Object.keys(b).length) return true
    if (Object.keys(a).length === 0) return false

    for (const key in a) if (isChange(a[key], b[key])) return true

    return false
  }

  return a !== b
}

const EmptyVal = [null, undefined, '', NaN]

export const isEmptyRecord = (target: any): boolean => {
  if (EmptyVal.includes(target)) return true
  if (isArray(target)) {
    if (target.length === 0) return true
    return target.every(isEmptyRecord)
  }
  if (isObject(target)) {
    const values = Object.values(target)
    if (values.length === 0) return true
    return values.every(isEmptyRecord)
  }
  return false
}
