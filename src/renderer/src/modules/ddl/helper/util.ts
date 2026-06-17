import { ObjectType } from '0type'
import { isArray } from 'asura-eye'
import { Dayjs } from 'dayjs'
import { Solar } from 'lunar-javascript'

const fmt = (list) =>
  list
    .filter((_) => (_[0] as number) > 0)
    .map((_) => _.join(''))
    .join(' ')

export const getAfterWorkMSG = (diffMs: number) => {
  if (diffMs < 1) return ''
  const diffSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(diffSeconds / 3600)
  const minutes = Math.floor((diffSeconds % 3600) / 60)
  const seconds = diffSeconds % 60

  return fmt([
    [hours, '小时'],
    [minutes, '分钟'],
    [seconds, '秒'],
  ])
}

export const getDayjs = (now: Dayjs, str: string): Dayjs => {
  const list = str.split('.').map(Number)
  if (list.length === 2) {
    const [MM, DD] = list
    return now.month(MM - 1).date(DD)
  }
  if (list.length === 3) {
    const [YYYY, MM, DD] = list
    return now
      .year(YYYY)
      .month(MM - 1)
      .date(DD)
  }
  return now
}

export const inBetweenTime = (
  time: Dayjs,
  start: string,
  end: string = start,
) => {
  const startTime = getDayjs(time, start).startOf('day')
  const endTime = getDayjs(time, end).endOf('day')
  return startTime.isBefore(time) && endTime.isAfter(time)
}

export const getFestivals = (Conf: ObjectType, now: Dayjs) => {
  const d = Solar.fromYmd(now.year(), now.month() + 1, now.date())
  const fe = d.getFestivals().concat(d.getOtherFestivals())
  const MM_DD = now.format('M.D')
  const YYYY_MM_DD = now.format(`YYYY.M.D`)

  const cFestival: string[] =
    Conf?.festival
      ?.filter((item) => {
        const [_, start, end] = item
        if (end && MM_DD !== start && YYYY_MM_DD !== start) {
          if (inBetweenTime(now, start, end)) return true
        }
        return MM_DD === start || YYYY_MM_DD === start
      })
      .map((_) => _[0]) || []

  return fe
    .filter((_) => !cFestival.includes(_))
    .concat(cFestival)
    .join(', ')
}

export const isHoliday = (Conf: ObjectType, now: Dayjs) => {
  const list = Conf.holiday
  if (!isArray<string[]>(list)) return false
  for (let i = 0; i < list.length; i++) {
    const [_name, start, end] = list[i]
    if (inBetweenTime(now, start, end)) return true
  }
  return false
}

export const isOvertimeWork = (Conf: ObjectType, now: Dayjs) => {
  const list = Conf.overtime
  if (!isArray<string[]>(list)) return false
  for (let i = 0; i < list.length; i++) {
    const [start, end]: string[] = list[i] as string[]
    if (inBetweenTime(now, start, end)) return true
  }
  return false
}
