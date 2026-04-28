import { ObjectType } from '0type'
import { getJSON } from '@/util'
import { isNumber } from 'asura-eye'

export const getRenderList = (
  list: ObjectType[],
  selectType: string = 'all',
) => {
  if (!selectType || selectType === 'all')
    return list.sort((a, b) => {
      if (a.star && !b.star) return -10
      if (!a.star && b.star) return 10
      return 0
    })

  if (selectType === 'star') return list.filter((_) => _.star)

  return list.filter((_) => _.type === selectType)
}

/**
 * 将指定时间转换为相对时间描述（例如：5分钟前、10小时后、3天前）
 * @param {number} now - 要计算的时间，支持Date对象、时间戳(毫秒)或ISO字符串
 * @param {number} target - 基准时间，默认为当前时间，可选
 * @returns {string} 相对时间描述，如“刚刚”、“5分钟前”、“2小时后”、“3天前”等
 */
export function formatRelativeTime(now: number, target: number): string {
  if (!isNumber(now) || !isNumber(target)) return ''
  const diffMs = now - target // 正数表示未来，负数表示过去

  // 取绝对值，统一计算时间差
  const absDiffSec = Math.abs(Math.floor(diffMs / 1000))
  const absDiffMin = Math.floor(absDiffSec / 60)
  const absDiffHour = Math.floor(absDiffMin / 60)
  const absDiffDay = Math.floor(absDiffHour / 24)
  const absDiffMonth = Math.floor(absDiffDay / 30) // 近似月
  const absDiffYear = Math.floor(absDiffDay / 365)

  // 过去或未来的方向词
  const isPast = diffMs > 0
  const suffix = isPast ? '前' : '后'

  // 小于1分钟
  if (absDiffSec < 60) {
    return isPast ? '刚刚' : '片刻后'
  }

  // 分钟级 (1分钟 ~ 59分钟)
  if (absDiffMin < 60) {
    return `${absDiffMin}分钟${suffix}`
  }

  // 小时级 (1小时 ~ 23小时)
  if (absDiffHour < 24) {
    return `${absDiffHour}小时${suffix}`
  }

  // 天级 (1天 ~ 29天)
  if (absDiffDay < 30) {
    return `${absDiffDay}天${suffix}`
  }

  // 月级 (30天 ~ 364天)
  if (absDiffMonth < 12) {
    return `${absDiffMonth}个月${suffix}`
  }

  // 年级
  return `${absDiffYear}年${suffix}`
}

export const openSettingFile = async (path: string) => {
  if (!path) return
  return window.api.invoke('cmd', `code ${path}\\clipboard.json`)
}

export const getClipboardList = async (path: string): Promise<ObjectType[]> => {
  if (!path) return []
  return getJSON(
    await window.api.invoke('fs', {
      action: 'readFile',
      payload: { path: path + '/clipboard.json' },
    }),
    [],
  )
}

export const saveClipboard2File = async (
  path: string,
  newState: ObjectType[],
) => {
  if (!path) return
  return window.api.invoke('fs', {
    action: 'saveFile',
    payload: {
      path: path + '/clipboard.json',
      // data: JSON.stringify(newState, null, 2),
      data: JSON.stringify(newState),
    },
  })
}

export const getUID = (item: ObjectType) => {
  return item.type === 'image' ? item.data.slice(0, 100) : item.data
}
