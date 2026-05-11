import { Icon } from '@/components'
import { Button } from 'antd'
import './info.less'
import { useMyState } from './state'
import { useMsg } from '@/util'
import { useSysStore } from '@/store/sys'

export function Info() {
  const sys = useSysStore()
  const { context, success, error } = useMsg()
  const { loading, setLoading, LocalIP, batteryPower, ddl, networkName, reload } =
    useMyState(sys)

  return (
    <div className="root-layout-home-view-info dashboard-info">
      <div className="module-bg gap">
        <div className="flex col gap relative">
          <Button
            style={{ top: -10, right: 0 }}
            loading={loading}
            icon={<Icon type="reload" style={{ fontSize: 16 }} />}
            className="bolder absolute"
            onClick={() => setLoading(reload())}
          />
          <div
            className="ddl-info-box"
            title="Click Copy..."
            onClick={async (e) => {
              e?.preventDefault()
              e?.stopPropagation()
              const res = await window.api.invoke('copy', {
                data: ddl.filter(Boolean).join('\n'),
              })
              res ? success('Copy Success...') : error('Copy Error...')
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
      {context}
    </div>
  )
}
