export * from './hook/use-set-state'
export * from './hook/use-loading'
export * from './hook/use-msg'
export * from './helper'
export * from './req'

import { isArray, isNumber, isObject, isString } from 'asura-eye'
import { message } from 'aurad'
import { copyText } from 'harpe'
import { v4 as getUUID } from 'uuid'
import * as cheerio from 'cheerio'
import { ObjectType } from '0type'

export const invoke = window.api.invoke

export { getUUID, cheerio }

export async function getCache(payload: ObjectType) {
  const res = await window.api.db({
    action: 'find',
    DBName: 'db',
    tableName: 'cache',
    payload,
  })
  return res?.data
}

export async function setCache(payload: ObjectType) {
  const res = await window.api.db({
    action: 'update',
    DBName: 'db',
    tableName: 'cache',
    payload,
  })
  return res
}
/**
 * @title isChange
 * @description Comparison value
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean} true: change, false: no-change
 *
 */
export const isChange = (a, b) => {
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

/**
 * @title firstUpperCase
 * @description Capitalized first letter
 * @param {String} target
 * @returns {String}
 */
export const firstUpperCase = (target) => {
  if (isString(target))
    return target.slice(0, 1).toUpperCase() + target.slice(1)
  return ''
}

/**
 * @title isEffectValue
 * @description To be valid, the items of the array values are valid, and the values of the object are also valid.
 * @param {any} target
 * @returns {Boolean}
 */
export const isEffectValue = (target) => {
  if (isArray(target)) {
    if (!target.length) return false
    return !!target.some(isEffectValue)
  }
  if (isObject(target)) {
    const keys = Object.keys(target)
    if (!keys.length) return false
    return !!keys.some((key) => isEffectValue(target[key]))
  }
  if (isNumber(target) && target < 1) {
    return true
  }
  if (isString(target)) {
    return !!target.trim()
  }
  return !!target
}

/**
 * @title likeValue
 * @description Search for similar values
 * @param {any} value
 * @param {any} likeRecord
 * @param {string|string[]} [keys]
 * @returns {boolean}
 */
export const likeValue = (
  value: any,
  likeRecord: any,
  keys?: string | string[],
) => {
  if (isString(value)) {
    if (isString(likeRecord))
      return likeRecord.toLowerCase().includes(value.trim().toLowerCase())
    if (isObject(likeRecord)) {
      if (isString(keys)) return likeValue(value, likeRecord[keys])
      if (isArray(keys))
        return keys.some((key) => likeValue(value, likeRecord[key]))

      return Object.keys(likeRecord).some((key) =>
        likeValue(value, likeRecord[key]),
      )
    }
    if (isArray(likeRecord)) {
      return likeRecord.some((record) => likeValue(value, record))
    }
  }
  return false
}

export const sleep = async (timeout: number = 500) =>
  new Promise<void>((rs) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      rs(undefined)
    }, timeout)
  })

export const get = async (url: string): Promise<Record<string, any>> => {
  const xhr = new XMLHttpRequest()
  return new Promise((rs) => {
    xhr.open('GET', url, true)

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 400) {
        const responseData = JSON.parse(xhr.responseText)
        rs({ code: 200, data: responseData })
      } else {
        rs({ code: xhr.status, data: null })
      }
    }

    xhr.onerror = function () {
      rs({ code: -1, data: null })
    }

    xhr.send()
  })
}

export const copy = (val: any) => {
  if (copyText(val)) {
    message.success('Copy Success ')
  } else {
    message.error('Copy Fail ')
  }
}

export const scrollIntoView = (querySelectorName: string) => {
  const dom = document.querySelector(querySelectorName)
  dom?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export const downloadJSON = (jsonString: string, filename: string) => {
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename || 'data.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
