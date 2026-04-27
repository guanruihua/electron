import React from 'react'
import { updateCountdown } from './helper/helper'
import { useLoading } from '@/util'
import { isBoolean, isString } from 'asura-eye'
import './info.less'

export const useMyState = () => {
  const [loading, setLoading] = useLoading()
  const [LocalIP, setLocalIP] = React.useState('0.0.0.0')
  const [batteryPower, setBatteryPower] = React.useState(false)
  const [ddl, setDDL] = React.useState<string[]>(['今天不用上班！'])
  const [networkName, setNetworkName] = React.useState('')
  const timer = React.useRef<NodeJS.Timeout | null>(null)

  async function updateNetworkName() {
    const cmd = `powershell -Command "Get-NetConnectionProfile | Select-Object -ExpandProperty Name"`
    const res = await window.api.invoke('cmdResult', cmd)
    if (isString(res)) setNetworkName(res)
  }

  const init = async () => {
    setDDL(await updateCountdown())
    const cb = async () => {
      timer.current && clearInterval(timer.current)
      setDDL(await updateCountdown())
      timer.current = setInterval(cb, 1000)
    }
    timer.current = setInterval(cb, 1000)

    await updateNetworkName()

    const [LIP, BatteryPower] = await window.api.invoke(
      'getSysInfo',
      'LocalIP,BatteryPower',
    )
    if (isString(LIP)) setLocalIP(LIP)
    if (isBoolean(BatteryPower)) setBatteryPower(BatteryPower)
    return
  }

  React.useEffect(() => {
    init()

    return () => {
      timer.current && clearInterval(timer.current)
    }
  }, [])

  return {
    loading,
    setLoading,
    LocalIP,
    batteryPower,
    ddl,
    networkName,
    init,
  }
}
