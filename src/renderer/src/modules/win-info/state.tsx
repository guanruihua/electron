import React from 'react'
import { useLoading } from '@/util'
import { isBoolean, isString } from 'asura-eye'
import { SysState } from '@/type'
import './info.less'

export const useWinInfoState = (sys: SysState) => {
  const [loading, setLoading] = useLoading()
  const [LocalIP, setLocalIP] = React.useState('0.0.0.0')
  const [batteryPower, setBatteryPower] = React.useState(false)
  const [networkName, setNetworkName] = React.useState('')

  async function updateNetworkName() {
    const cmd = `powershell -Command "Get-NetConnectionProfile | Select-Object -ExpandProperty Name"`
    const res = await window.api.invoke('cmdResult', cmd)
    if (isString(res)) setNetworkName(res)
  }

  const reload = async () => {
    if (!sys.initSuccess || !sys.path) return

    await updateNetworkName()
    const [LIP, BatteryPower] = await window.api.invoke(
      'getSysInfo',
      'LocalIP,BatteryPower',
    )
    if (isString(LIP)) setLocalIP(LIP)
    if (isBoolean(BatteryPower)) setBatteryPower(BatteryPower)
  }

  React.useEffect(() => {
    reload()
  }, [sys.initSuccess, sys.path])

  return {
    loading,
    setLoading,
    LocalIP,
    batteryPower,
    networkName,
    reload,
  }
}
