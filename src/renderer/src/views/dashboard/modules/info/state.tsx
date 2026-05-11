import React from 'react'
import { updateCountdown } from './helper/helper'
import { getJSON, useLoading } from '@/util'
import { isBoolean, isString } from 'asura-eye'
import './info.less'
import { SysState } from '@/type'

export const useMyState = (sys: SysState) => {
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

  const clear = () => {
    timer.current && clearInterval(timer.current)
  }

  const reload = async () => {
    if (!sys.initSuccess) return

    await updateNetworkName()
    const [LIP, BatteryPower] = await window.api.invoke(
      'getSysInfo',
      'LocalIP,BatteryPower',
    )
    if (isString(LIP)) setLocalIP(LIP)
    if (isBoolean(BatteryPower)) setBatteryPower(BatteryPower)

    const path = sys.path + '\\ddl.json'
    const res = await window.api.fs('readFile', { path })
    if (!isString(res)) return
    const Conf = getJSON(res)

    timer.current && clearInterval(timer.current)
    console.log('run...')
    setDDL(await updateCountdown(Conf))
    const cb = async () => {
      setDDL(await updateCountdown(Conf))
      timer.current = setInterval(cb, 1000)
    }
    timer.current = setInterval(cb, 1000)
  }

  React.useEffect(() => {
    if (sys.initSuccess) {
      reload()
    }

    return clear
  }, [sys.initSuccess])

  return {
    loading,
    setLoading,
    LocalIP,
    batteryPower,
    ddl,
    networkName,
    reload,
  }
}
