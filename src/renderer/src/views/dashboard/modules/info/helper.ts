import { isArray } from 'asura-eye'
import dayjs from 'dayjs'
import { Dayjs } from 'dayjs'

const fmt = (list) =>
  list
    .filter((_) => (_[0] as number) > 0)
    .map((_) => _.join(''))
    .join(' ')

const Conf = {
  // 下班时间
  afterWork: '18:00',
  // 假期
  holiday: [
    ['五一假期', '5.1', '5.4'],
    ['端午假期', '6.19', '6.21'],
    ['中秋假期', '9.25', '9.27'],
    ['国庆假期', '10.1', '10.7'],
    ['元旦假期', '1.1', '1.3'],
    ['春节假期', '2027.2.5', '2027.2.11'],
    ['清明假期', '2027.4.4', '2027.4.6'],
  ],
  // 加班
  overtime: [],
}

const getAfterWorkMSG = (diffMs: number) => {
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

const getTime = () => {
  const [h = 18, m = 0, s = 0] = Conf.afterWork.split(/:|\s/).map(Number)
  const now = dayjs()
  const afterWork = now.hour(h).minute(m).second(s).millisecond(0)
  const diffMs = afterWork.diff(now)
  return {
    now,
    afterWork,
    diffMs,
  }
}

const getDayjs = (now: Dayjs, str: string): Dayjs => {
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

export function updateCountdown(): string[] {
  const { now, diffMs } = getTime()
  const res: string[] = []
  const afterWorkMSG = getAfterWorkMSG(diffMs)
  const isHoliday = (() => {
    if (isArray(Conf.holiday))
      for (const item of Conf.holiday) {
        const [_, start, end = start] = item as string[]
        const startTime = getDayjs(now, start).startOf('day')
        const endTime = getDayjs(now, end).endOf('day')
        if (startTime.isBefore(now) && endTime.isAfter(now)) return true
      }
    if (isArray(Conf.overtime))
      for (const item of Conf.overtime) {
        const [start, end = start] = item as string[]
        const startTime = getDayjs(now, start).startOf('day')
        const endTime = getDayjs(now, end).endOf('day')
        if (startTime.isBefore(now) && endTime.isAfter(now)) return false
      }
    return [0, 6].includes(now.day())
  })()

  if (isHoliday) {
    res.push('今天不用上班！')
  } else if (diffMs < 1) {
    res.push('下班啦！')
  } else {
    res.push(`距离下班还有：${afterWorkMSG}`)
  }

  if (now.day() === 5) {
    res.push(`明天就是周末！！！！！`)
  } else if (![0, 6].includes(now.day())) {
    res.push(`距离周末还有：${5 - now.day()}天`)
  }
  Conf?.holiday?.map((item) => {
    const [name, start = ''] = item
    const target = getDayjs(now, start)
    const diff = (target.valueOf() - now.valueOf()) / 86400000 - 1

    if (diff > 1) {
      res.push(`距离${name}还有：${diff}天`)
    } else if (diff === 1) {
      res.push(`明天就是${name}！！！！`)
    }
  })

  return res
}
