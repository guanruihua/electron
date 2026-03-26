import { ObjectType } from '0type'
import { Icon } from '@/components'
import { ModuleProps } from '@/type'
import { Button } from 'antd'
import { isString } from 'asura-eye'
import { useLoadings, getModules, Loadings } from '@/util'

const Module = (props: ModuleProps & { item: ObjectType }) => {
  const { h, item } = props
  const { handle } = h
  const viewLoadings: Loadings = h.loadings || {}
  const [loadings = {}, setLoadings] = useLoadings({
    run: false,
    stop: false,
  })

  if (isString(item?.type) && item.type.toLowerCase() === 'group')
    return (
      <div className="grid-span-full">
        <span className="bold text-12 pointer">{item.label || item.path}</span>
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
      className="opt-item flex box-shadow"
      data-path={item.path.replaceAll('\\', '>')}
      data-start
      data-pid
      title={item.label || item.path}
    >
      <span className="opt-item-name bold">{item.label || item.path}</span>
      <span className="opt-item-btns flex items-center">
        <Icon
          loading={loadings.run || viewLoadings.stopAll || viewLoadings.findAll}
          type="run"
          className="opt run"
          data-disabled={!item.npm}
          onClick={() =>
            setLoadings(handle?.NodeThread?.dev?.(item, true), 'run')
          }
        />
        <Icon
          loading={loadings.stop || viewLoadings.stopAll || viewLoadings.findAll}
          type="stop"
          className="opt stop"
          onClick={() =>
            setLoadings(handle.NodeThread.stopModule(item, true), 'stop')
          }
        />

        {item?.web && (
          <>
            {/* <Icon
              loading={loadings.addTab}
              type="web"
              className="opt web"
              onClick={() =>
                setLoadings(handle?.addTab({ url: item.web }), 'addTab')
              }
            /> */}
            <Icon
              loading={loadings.google}
              type="google"
              className="opt google"
              onClick={() =>
                setLoadings(
                  window.api.invoke('cmd', `start chrome ${item.web}`),
                  'google',
                )
              }
            />
          </>
        )}
        <Icon
          loading={loadings.git}
          type="git"
          className="opt git"
          onClick={() => setLoadings(handle.git(item), 'git')}
        />
        <Icon
          loading={loadings.vscode}
          type="vscode"
          className="opt open"
          onClick={() => {
            setLoadings(window.api.invoke('cmd', `code ${item.path}`), 'vscode')
          }}
        />
        <Icon
          loading={loadings.dir}
          type="dir"
          className="opt dir"
          onClick={() =>
            setLoadings(
              window.api.invoke('cmd', `explorer "${item.path}"`),
              'dir',
            )
          }
        />
      </span>
    </div>
  )
}

export function Modules(props: ModuleProps) {
  const { h } = props
  const { handle, state } = h
  const viewLoadings = h.loadings || {}

  const [loadings, setLoadings] = useLoadings({
    edit: false,
    reload: false,
  })

  const openConfFile = async () => {
    if (!state.sysSetting?.path) return
    return window.api.invoke('cmd', `code ${state.sysSetting.path}\\modules.json`)
  }

  const reload = async () => {
    if (!state.setting?.path) return
    const modules = await getModules(state.setting.path)
    if (!state.selectGitModule?.path) state.selectGitModule = modules[0]
    handle.setState({ modules })
    handle.renderState()
    handle.setLoadings(handle.findAll_NodeThread(), 'findAll')
  }

  return (
    <div className="root-layout-home-view-modules">
      <div className="module-bg" style={{ padding: 0 }}>
        <div
          className="flex space-between items-center mb"
          style={{ padding: '20px 20px 0' }}
        >
          <h4>Module</h4>
          <div className="flex gap">
            <Button
              loading={loadings.edit}
              onClick={() => setLoadings(openConfFile(), 'edit')}
            >
              Edit
            </Button>
            <Button
              loading={
                loadings.reload || viewLoadings.stopAll || viewLoadings.findAll
              }
              icon={<Icon type="reload" style={{ fontSize: 16 }} />}
              className="bolder"
              onClick={() => setLoadings(reload(), 'reload')}
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
