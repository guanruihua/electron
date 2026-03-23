import { ModuleProps } from '@/type'
import { isString } from 'asura-eye'
import dayjs from 'dayjs'
import React from 'react'

export function Info(props: ModuleProps) {
  const {} = props
  
  const [LocalIP, setLocalIP] = React.useState('0.0.0.0')
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
    if (hours < 1 && minutes < 1) {
      return `距离下班还有：${seconds}秒`
    }
    return `距离下班还有：${hours}小时 ${minutes}分钟 ${seconds}秒`
  }

  const init = async () => {
    const LIP = await window.api.invoke('getLocalIP')
    if (isString(LIP)) {
      setLocalIP(LIP)
    }
  }

  React.useEffect(() => {
    init()
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
      <div className="module-bg gap">
        <div className="flex col gap">
          <h4>Info</h4>
          <div className="text-14">{ddl}</div>
          <h4>Local IP</h4>
          <div className="text-14">{LocalIP}</div>
        </div>
      </div>
    </div>
  )
}
