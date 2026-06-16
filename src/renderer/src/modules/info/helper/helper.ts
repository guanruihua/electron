import dayjs, { Dayjs } from 'dayjs'
import { isArray } from 'asura-eye'
import {
  isHoliday,
  isOvertimeWork,
  getAfterWorkMSG,
  getFestivals,
  getDayjs,
} from './util'
import { ObjectType } from '0type'
import { Solar } from 'lunar-javascript'

type DayType = 'WorkingDay' | 'Weekend' | 'Holiday' | 'OvertimeWork'

export const getTime = (Conf: ObjectType) => {
  const [h = 18, m = 0, s = 0] = Conf.afterWork.split(/:|\s/).map(Number)
  const now = dayjs()
  const afterWork = now.hour(h).minute(m).second(s).millisecond(0)
  const diffMs = afterWork.diff(now)

  const DAYs: [Dayjs, DayType][] = [
    [now, 'WorkingDay'],
    [now.add(1, 'day'), 'WorkingDay'],
    [now.add(2, 'day'), 'WorkingDay'],
    [now.add(3, 'day'), 'WorkingDay'],
    [now.add(4, 'day'), 'WorkingDay'],
    [now.add(5, 'day'), 'WorkingDay'],
  ]

  // 周末
  DAYs.forEach((item, i) => {
    const [time, type] = item
    if (type === 'Weekend') return
    if ([0, 6].includes(time.day())) DAYs[i][1] = 'Weekend'
  })

  // 假期
  if (isArray(Conf?.holiday)) {
    DAYs.forEach((item, i) => {
      const [time, type] = item
      if (type === 'Holiday') return
      if (isHoliday(Conf, time)) DAYs[i][1] = 'Holiday'
    })
  }
  // 加班
  if (isArray(Conf?.holiday)) {
    DAYs.forEach((item, i) => {
      const [time, type] = item
      if (type === 'OvertimeWork') return
      if (isOvertimeWork(Conf, time)) DAYs[i][1] = 'OvertimeWork'
    })
  }

  return {
    now,
    afterWork,
    diffMs,
    DAYs,
  }
}

export async function updateCountdown(Conf: ObjectType): Promise<string[]> {
  const { now, diffMs, DAYs } = getTime(Conf)
  const res: string[] = [
    {
      0: '星期日🐱',
      1: '星期一🌱',
      2: '星期二🍞',
      3: '星期三🐸',
      4: '星期四🍀',
      5: '星期五🎉',
      6: '星期六🎈',
    }[now.day()] + '也要开开心心地过呀 (｡•ᴗ•｡)♡',
  ]
  const afterWorkMSG = getAfterWorkMSG(diffMs)

  const isHoliday = !['WorkingDay', 'OvertimeWork'].includes(DAYs[0][1])

  if (isHoliday) {
    res.push('今天不用上班！')
  } else if (diffMs < 1) {
    res.push('下班啦！')
  } else {
    res.push(`距离下班还有：${afterWorkMSG}`)
  }

  if (![0, 6].includes(now.day())) {
    let total = 0
    for (let i = 0; i < DAYs.length; i++) {
      const type = DAYs[i][1]
      if (['WorkingDay', 'OvertimeWork'].includes(type)) {
        ++total
        continue
      }
      break
    }
    if (total === 1) res.push(`明天就是周末！！！！！`)
    if (total > 1) res.push(`距离周末还有：${total - 1}天`)
  }

  res.push('---------------')
  if (Conf?.weatherInfo?.length) {
    res.push(...Conf.weatherInfo)
    res.push('---------------')
  }
  // 今天节日

  const festivals = getFestivals(Conf, now)
  if (festivals) res.push(`今天是${festivals}`)

  // 明天节日
  const nextDay = now.add(1, 'day')
  const nFestivals = getFestivals(Conf, nextDay)
  if (nFestivals) res.push(`明天是${nFestivals}`)

  res.push(`公历: ${now.format('YYYY年MM月DD日')}`)
  const lunar = Solar.fromDate(new Date()).getLunar()
  res.push(`农历: ${lunar.toString()}`)

  res.push('---------------')
  // 假期
  if (isArray(Conf?.holiday))
    Conf.holiday.map((item) => {
      const [name, start = ''] = item
      const target = getDayjs(now, start)
      const diff = (target.valueOf() - now.valueOf()) / 86400000 - 1

      if (diff > 0) {
        res.push(`距离${name}还有：${diff}天`)
      } else if (diff === 0) {
        res.push(`明天就是${name}！！！！！`)
      }
    })

  return res
}
