import { Icon } from '@/components'
import { Button } from 'antd'
import './info.less'
import { ModuleProps } from '@/type'
import { useMyState } from './state'

export function Info(props: ModuleProps) {
  const { handle } = props.h
  const { loading, setLoading, LocalIP, batteryPower, ddl, networkName, init } =
    useMyState()

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
            className="ddl-info-box"
            title="Click Copy..."
            onClick={async (e) => {
              e?.preventDefault()
              e?.stopPropagation()
              const res = await window.api.invoke('copy', {
                data: ddl.filter(Boolean).join('\n'),
              })
              res
                ? handle.success('Copy Success...')
                : handle.error('Copy Error...')
            }}
          >
            {ddl.map((val) => (
              <div key={val} className="ddl-info">
                {val}
              </div>
            ))}
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
