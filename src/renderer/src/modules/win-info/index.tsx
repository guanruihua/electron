import { Icon } from '@/components'
import { Button } from 'antd'
import './info.less'
import { useWinInfoState } from './state'
import { useSysStore } from '@/store/sys'

export function WinInfo() {
  const sys = useSysStore()
  const { loading, setLoading, LocalIP, batteryPower, networkName, reload } =
    useWinInfoState(sys)

  return (
    <div className="dashboard-info flex col gap relative">
      <div className="flex gap absolute" style={{ top: 10, right: 10 }}>
        <Button
          loading={loading}
          icon={<Icon type="reload" style={{ fontSize: 16 }} />}
          onClick={() => setLoading(reload())}
        />
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
  )
}
