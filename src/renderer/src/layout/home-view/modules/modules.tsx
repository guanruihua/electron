import { ObjectType } from '0type'
import { Icon } from '../../components'
import { ModuleProps } from '../../type'
import { Button } from 'antd'
import { isString } from 'asura-eye'

const Module = (props: ModuleProps & { item: ObjectType }) => {
  const { h, item } = props
  const { handle } = h

  if (isString(item?.type) && item.type.toLowerCase() === 'group')
    return (
      <div className="grid-span-full">
        <span className="bold text-14 pointer">{item.label || item.path}</span>
        <div
          className="grid-layout grid gap"
          style={{
            marginTop: 10,
          }}
        >
          {item.children?.map?.((item, i) => (
            <Module key={i} item={item} h={props.h} />
          ))}
        </div>
      </div>
    )

  return (
    <div
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
        <Icon type="git" className="opt git" onClick={() => handle.git(item)} />
        <Icon
          type="dir"
          className="opt dir"
          onClick={() => window.api.invoke('cmd', `explorer "${item.path}"`)}
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
  )
}

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
            <Button onClick={() => handle.module.openConfFile()}>Edit</Button>
            <Button
              icon={<Icon type="reload" style={{ fontSize: 16 }} />}
              className="bolder"
              onClick={() => handle.module.reload()}
            />
          </div>
        </div>
        <div className="root-layout-home-view-modules-container grid overflow-y gap">
          {state?.modules?.map?.((item, i) => (
            <Module key={i} item={item} h={props.h} />
          ))}
        </div>
      </div>
    </div>
  )
}
