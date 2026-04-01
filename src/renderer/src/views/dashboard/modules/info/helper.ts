import dayjs from 'dayjs'

export function updateCountdown(timer) {
  const now = dayjs()
  if ([0, 6].includes(now.day())) {
    if (timer.current) clearInterval(timer.current)
    return '今天不用上班！'
  }
  let target = dayjs().hour(18).minute(0).second(0).millisecond(0)
  if (now.isAfter(target)) {
    target = target.add(1, 'day')
  }

  const diffMs = target.diff(now)
  if (diffMs <= 0) {
    if (timer.current) clearInterval(timer.current)
    return '下班啦！'
  }

  const diffSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(diffSeconds / 3600)
  const minutes = Math.floor((diffSeconds % 3600) / 60)
  const seconds = diffSeconds % 60
  if (hours < 1) {
    return `距离下班还有：${minutes}分钟 ${seconds}秒`
  }
  if (hours < 1 && minutes < 1) {
    return `距离下班还有：${seconds}秒`
  }
  return `距离下班还有：${hours}小时 ${minutes}分钟 ${seconds}秒`
}
