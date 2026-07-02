import { Icon } from '@/components'
import { Button } from 'antd'
import { useSysStore } from '@/store/sys'
import { useLoadings } from '@/util'

export function User() {
  const sys = useSysStore()
  const [loadings, setLoadings] = useLoadings()

  const list = [
    ['Total Modules', sys.modules?.length || 0],
    ['Setting Path', sys.path],
    ['Ignore APP', sys.ignoreApps],
  ]

  return (
    <div className="user-setting layout-module">
      <div className="flex gap">
        <Button
          loading={loadings.edit_env}
          icon={<Icon type="edit" />}
          onClick={() => {
            setLoadings(
              window.api.invoke('cmd', `code ${sys.path}\\env.json`),
              'edit_env',
            )
          }}
        >
          ENV
        </Button>
        <Button
          loading={loadings.edit}
          icon={<Icon type="edit" />}
          onClick={() => {
            setLoadings(
              window.api.invoke('cmd', `code ${sys.path}\\setting.json`),
              'edit',
            )
          }}
        >
          Setting
        </Button>
        <Button
          loading={loadings.init}
          icon={<Icon type="reload" style={{ fontSize: 16 }} />}
          className="bolder"
          onClick={() => setLoadings(sys.init(true), 'init')}
        />
      </div>
      <div className="user-setting-container">
        {list.map((row, i) => {
          const [name, value] = row
          return (
            <div key={i} className="user-setting-row">
              <div className="name">{name}</div>
              <div className="value">{value}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
