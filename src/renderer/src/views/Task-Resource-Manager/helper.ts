import { ObjectType } from '0type'
import { isString } from 'asura-eye'

const getStatus = (total: number) => {
  if (total < 1024 * 100) return 'low'
  if (total < 1024 * 1000) return 'medium'
  if (total > 1024 * 1000) return 'high'
  return 'low'
}

function isEffectName(name: string) {
  if (!isString(name)) return false
  return /^[a-zA-Z0-9\u4e00-\u9fa5 \s_]+$/.test(name)
}

const getRow = (row: string) => {
  const list = row.split(/\s{1,}/).map((_) => _.trim())

  if (list.length !== 4) {
    let nameIndex = -1
    let pmIndex = -1
    list.forEach((item, i) => {
      const isNum = /^\d+$/.test(item)
      if (isNum) {
        if (nameIndex === -1) return (nameIndex = i)
        if (pmIndex === -1) return (pmIndex = i)
      }
      return
    })
    const res = {
      name: list.slice(0, nameIndex).join(' '),
      Id: list[nameIndex],
      PM: list[pmIndex],
      SoftwareName: list.slice(pmIndex + 1).join(' '),
    }
    // if (row.includes('Microsoft Edge WebView2')) {
    //   console.log(res, list)
    // }

    return res
  }
  const [name, Id, PM, SoftwareName] = list
  return {
    name,
    Id,
    PM,
    SoftwareName: SoftwareName,
  }
}

export const format = (target: any) => {
  if (!isString(target)) return []
  // console.log(target)
  const list: string[] = target
    .split('\r\n')
    .filter(Boolean)
    .map((_) => _.trim())

  const USE: ObjectType<string[]> = {}
  const IDS: ObjectType<(number | string)[]> = {}
  const MAP: ObjectType<string> = {}

  list?.forEach((row, i) => {
    if (i < 2) return
    const { name, Id, PM, SoftwareName } = getRow(row)
    if (!MAP[name]) {
      if (isEffectName(SoftwareName)) {
        MAP[name] = SoftwareName
      } else {
        MAP[name] = name
        // console.log(name, newSoftwareName)
      }
    }
    if (!USE[name]) USE[name] = []
    if (!IDS[name]) IDS[name] = []

    USE[name].push(PM)
    const uid = Number(Id)
    if (isNaN(uid)) {
      IDS[name].push(Id)
    } else {
      IDS[name].push(uid)
    }
  })

  return Object.keys(USE)
    .map((name) => {
      const use = USE[name]
      const total = use.reduce((t, num) => t + Number(num), 0)
      const sum = total > 1024 ? kbToMb(total) + 'MB' : total + 'KB'
      return {
        name,
        softwareName: MAP[name],
        sum,
        total,
        status: getStatus(total),
        UIDs: IDS[name].sort((a: any, b: any) => a - b).join(', '),
      }
    })
    .sort((a, b) => b.total - a.total)
}

export function kbToMb(kb, decimals = 2) {
  const mb = kb / 1024
  return parseFloat(mb.toFixed(decimals))
}
