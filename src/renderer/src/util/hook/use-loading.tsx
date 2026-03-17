import { ObjectType } from '0type'
import { isArray, isBoolean, isNumber, isPromise, isString } from 'asura-eye'
import { useState } from 'react'

export const useLoading = (
  defaultValue: boolean = false,
): [
  loading: boolean,
  setLoading: (target: number | boolean | Promise<any>) => Promise<boolean>,
] => {
  const [loading, setLoading] = useState<boolean>(defaultValue)

  return [
    loading,
    async (target: number | boolean | Promise<any>) => {
      if (isBoolean(target)) {
        setLoading(target)
        return true
      }
      if (isNumber(target)) {
        setLoading(true)
        return new Promise<boolean>((rs) => {
          const timer = setTimeout(() => {
            setLoading(false)
            clearTimeout(timer)
            rs(true)
          }, target)
        })
      }
      if (isPromise(target)) {
        setLoading(true)

        return new Promise<boolean>((rs) => {
          target.finally(() => {
            setLoading(false)
            rs(true)
          })
        })
      }
      return false
    },
  ]
}

export const useLoadings = (
  defaultValue: ObjectType<boolean> = {},
): [
  loadings: Record<string, boolean>,
  setLoadings: (
    target: number | boolean | Promise<any>,
    key?: string | string[],
  ) => Promise<boolean>,
] => {
  const [loadings, _setLoadings] =
    useState<ObjectType< boolean>>(defaultValue)
  const setLoadings = (value: boolean = false, key?: string | string[]) => {
    if (isString(key)) loadings[key] = value
    else if (isArray(key)) key.forEach((k) => (loadings[k] = value))
    else for (const k in loadings) loadings[k] = value
    _setLoadings(loadings)
    return
  }

  return [
    loadings,
    async (
      target: number | boolean | Promise<any>,
      key?: string | string[],
    ): Promise<boolean> => {
      if (isBoolean(target)) {
        setLoadings(target, key)
        return true
      }

      if (isNumber(target)) {
        setLoadings(true, key)
        return new Promise<boolean>((rs) => {
          const timer = setTimeout(() => {
            setLoadings(false, key)
            clearTimeout(timer)
            rs(true)
          }, target)
        })
      }

      if (isPromise(target)) {
        setLoadings(true, key)

        return new Promise<boolean>((rs) => {
          target.finally(() => {
            setLoadings(false, key)
            rs(true)
          })
        })
      }
      return false
    },
  ]
}
