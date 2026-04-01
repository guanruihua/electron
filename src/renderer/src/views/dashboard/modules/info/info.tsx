import { useLoading } from '@/util'
import { isBoolean, isString } from 'asura-eye'
import { Icon } from '@/components'
import { Button } from 'antd'
import React from 'react'
import { updateCountdown } from './helper'
import './info.less'

export function Info() {
  const [loading, setLoading] = useLoading()
  const [LocalIP, setLocalIP] = React.useState('0.0.0.0')
  const [batteryPower, setBatteryPower] = React.useState(false)
  const [ddl, setDDL] = React.useState('今天不用上班！')
  const [networkName, setNetworkName] = React.useState('')
  const timer = React.useRef<NodeJS.Timeout | null>(null)

  async function updateNetworkName() {
    const cmd = `powershell -Command "Get-NetConnectionProfile | Select-Object -ExpandProperty Name"`
    const res = await window.api.invoke('cmdResult', cmd)
    if (isString(res)) setNetworkName(res)
  }

  const init = async () => {
    setDDL(updateCountdown(timer))

    timer.current = setInterval(() => {
      setDDL(updateCountdown(timer))
    }, 1000)

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

  return (
    <div className="root-layout-home-view-info dashboard-info">
      <div className="module-bg gap">
        <div className="flex col gap relative">
          <Button
            style={{ top: -10, right: 0 }}
            loading={loading}
            icon={<Icon type="reload" style={{ fontSize: 16 }} />}
            className="bolder absolute"
            onClick={() => setLoading(init())}
          />
          <h4>Info</h4>
          <div
            className="text-14"
            style={{
              paddingBottom: 10,
              borderBottom: '2px solid rgba(255,255,255, .2)',
            }}
          >
            {ddl}
          </div>

          <div className="dashboard-info-row">
            <h4>Network Name</h4>
            <div>{networkName}</div>
          </div>
          <div className="dashboard-info-row">
            <h4>Local IP</h4>
            <div>{LocalIP}</div>
          </div>
          <div className="dashboard-info-row">
            <h4>充电中</h4>
            <div>{(!batteryPower).toString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
