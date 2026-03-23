import { ModuleProps } from '@/layout/type'
import dayjs from 'dayjs'
import React from 'react'

export function Info(props: ModuleProps) {
  const {} = props
  const [ddl, setDDL] = React.useState('今天不用上班！')
  const timer = React.useRef<NodeJS.Timeout | null>(null)
  function updateCountdown() {
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
    if (hours<1 && minutes < 1) {
      return `距离下班还有：${seconds}秒`
    }
    return `距离下班还有：${hours}小时 ${minutes}分钟 ${seconds}秒`
  }
  React.useEffect(() => {
    setDDL(updateCountdown())

    timer.current = setInterval(() => {
      setDDL(updateCountdown())
    }, 1000)

    return () => {
      timer.current && clearInterval(timer.current)
    }
  }, [])

  return (
    <div className="root-layout-home-view-info">
      <div className="module-bg">
        <div className="flex col gap">
          <h4>Info</h4>
          <div>{ddl}</div>
        </div>
      </div>
    </div>
  )
}
