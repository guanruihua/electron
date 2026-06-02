import { Icon } from '@/components'
import { Button } from 'antd'
import './info.less'
import { useMyState } from './state'
import { useMsg } from '@/util'
import { useSysStore } from '@/store/sys'
import { useTaskStore } from '@/store/task'

export function Info() {
  const sys = useSysStore()
  const task = useTaskStore()
  const { loadings } = task
  const { context, success, error } = useMsg()
  const {
    loading,
    setLoading,
    LocalIP,
    batteryPower,
    ddl,
    networkName,
    reload,
  } = useMyState(sys)

  return (
    <div className="layout-module root-layout-home-view-info dashboard-info">
      <div className="">
        <div className="flex col gap relative">
          <div className="flex gap absolute" style={{ top: -10, right: 0 }}>
            <Button
              icon={<Icon type="edit" />}
              loading={loadings.info}
              onClick={() =>
                task.add({
                  id: 'info__edit-ddl-json-file',
                  name: 'Edit Info/ddl JSON File',
                  async exec() {
                    return await window.api.invoke(
                      'cmd',
                      `code ${sys.path}\\ddl.json`,
                    )
                  },
                })
              }
            />
            <Button
              loading={loading}
              icon={<Icon type="reload" style={{ fontSize: 16 }} />}
              onClick={() => setLoading(reload())}
            />
          </div>
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
            {ddl.map((val, i) => (
              <div key={val + i} className="ddl-info">
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
