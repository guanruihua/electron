import { Icon } from '../../components'
import { ModuleProps } from '../../type'
import { Button } from 'antd'

export function Modules(props: ModuleProps) {
  const { handle, state } = props.h

  return (
    <div className="root-layout-home-view-modules">
      <div className="module-bg" style={{ padding: 0 }}>
        <div
          className="flex space-between items-center mb"
          style={{ padding: '20px 20px 0' }}
        >
          <h4>Module</h4>
          <div className="flex gap">
            <Button onClick={() => handle.openModuleSetting()}>Edit</Button>
            <Button
              icon={<Icon type="reload" style={{ fontSize: 16 }} />}
              className="bolder"
              onClick={() => handle?.NodeThread?.findAll(true)}
            />
          </div>
        </div>
        <div
          className="grid overflow-y gap"
          style={{
            gridTemplateColumns: '1fr 1fr 1fr',
            maxHeight: `calc(var(--h) - 150px)`,
            padding: 20,
          }}
          onClick={()=>{

          }}
        >
          {state?.modules?.map?.((item, i) => (
            <div
              key={i}
              className="opt-item flex col border border-radius box-shadow px pb"
              data-path={item.path.replaceAll('\\', '>')}
              data-start
              data-pid
              title={item.label || item.path}
            >
              <span
                className="bold text-10 pointer"
                onClick={() => window.api.invoke('cmd', `code ${item.path}`)}
              >
                {item.label || item.path}
              </span>
              <span className="flex items-center">
                <Icon
                  type="vscode"
                  className="opt open"
                  onClick={() => {
                    window.api.invoke('cmd', `code ${item.path}`)
                  }}
                />
                <Icon
                  type="git"
                  className="opt git"
                  onClick={() => handle.git(item)}
                />
                <Icon
                  type="dir"
                  className="opt dir"
                  onClick={() =>
                    window.api.invoke('cmd', `explorer "${item.path}"`)
                  }
                />
                {item?.web && (
                  <>
                    <Icon
                      type="web"
                      className="opt web"
                      onClick={() => handle?.addTab({ url: item.web })}
                    />
                    <Icon
                      type="google"
                      className="opt google"
                      onClick={() =>
                        window.api.invoke('cmd', `start chrome ${item.web}`)
                      }
                    />
                  </>
                )}
                <Icon
                  type="run"
                  className="opt run"
                  data-disabled={!item.npm}
                  onClick={() => handle?.NodeThread?.dev?.(item, true)}
                />
                <Icon
                  type="stop"
                  className="opt stop"
                  onClick={() => handle.NodeThread.stopModule(item, true)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
