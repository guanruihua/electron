import { ObjectType } from '0type'
import { isArray, isBoolean, isNumber, isPromise, isString } from 'asura-eye'
import { useEffect } from 'react'
import { useState } from 'react'

export type SetLoading = (
  target: number | boolean | Promise<any>,
) => Promise<boolean>

export const useLoading = (
  defaultValue: boolean = false,
): [
  loading: boolean,
  setLoading: (target: number | boolean | Promise<any>) => Promise<boolean>,
] => {
  const [loading, setLoading] = useState<boolean>(defaultValue)

  let timer: NodeJS.Timeout | null = null
  useEffect(() => {
    return () => {
      timer && clearTimeout(timer)
    }
  }, [])

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
          timer = setTimeout(() => {
            setLoading(false)
            rs(true)
            if (timer) {
              clearTimeout(timer)
              timer = null
            }
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

export type SetLoadings = (
  target: number | boolean | Promise<any>,
  key?: string | string[],
) => Promise<boolean>

export type Loadings =  Record<string, boolean>

export const useLoadings = (
  defaultValue: ObjectType<boolean> = {},
): [loadings: Record<string, boolean>, setLoadings: SetLoadings] => {
  const [loadings, _setLoadings] = useState<ObjectType<boolean>>(defaultValue)

  const set = async (value: boolean = false, key?: string | string[]) => {
    const newLoadings = { ...loadings }
    if (isString(key)) newLoadings[key] = value
    else if (isArray(key)) key.forEach((k) => (newLoadings[k] = value))
    else for (const k in newLoadings) newLoadings[k] = value
    _setLoadings(newLoadings)
    console.log('set', newLoadings)
    return true
  }

  let timer: NodeJS.Timeout | null = null
  useEffect(() => {
    return () => {
      timer && clearTimeout(timer)
    }
  }, [])

  return [
    loadings,
    async (
      target: number | boolean | Promise<any>,
      key?: string | string[],
    ): Promise<boolean> => {
      if (isBoolean(target)) {
        return set(target, key)
      }

      if (isNumber(target)) {
        set(true, key)
        return new Promise<boolean>((rs) => {
          timer = setTimeout(async () => {
            rs(await set(false, key))
            if (timer) {
              clearTimeout(timer)
              timer = null
            }
          }, target)
        })
      }

      if (isPromise(target)) {
        set(true, key)

        return new Promise<boolean>((rs) => {
          target.finally(() => {
            rs(set(false, key))
          })
        })
      }
      return false
    },
  ]
}
