import { isArray, isNumber, isObject, isString } from 'asura-eye'

const len = 3

export const getGap = (row: any) => {
  if (isArray(row)) return ['[', ']']
  if (isObject(row)) return ['{', '}']
  return ['', '']
}

const isSimple = (value: any) => {
  return (
    isNumber(value) || isString(value) || [undefined, null, ''].includes(value)
  )
}

export const getStatus = (row: any) => {
  const res = {
    simpleArray: false,
    simpleObject: false,
  }
  if (isArray(row)) {
    if (row.length <= len) {
      const values2 = row.filter(isSimple)
      if (values2.length === row.length) res.simpleArray = true
    }
  }
  // if (isObject(row)) {
  //   const values = Object.values(row)
  //   if (values.length <= len) {
  //     const values2 = values.filter(isSimple)
  //     if (values2.length === values.length) res.simpleObject = true
  //   }
  // }
  return res
}
