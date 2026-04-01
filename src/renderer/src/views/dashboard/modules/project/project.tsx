import { Icon } from '@/components'
import { ModuleProps } from '@/type'
import { Button } from 'antd'
import { useLoadings, getModules } from '@/util'
import { Module } from './module'

export default function ProjectDashboard(props: ModuleProps) {
  const { h } = props
  const { handle, state } = h
  const viewLoadings = h.loadings || {}

  const [loadings, setLoadings] = useLoadings({
    edit: false,
    reload: false,
  })

  const openConfFile = async () => {
    if (!state.sysSetting?.path) return
    return window.api.invoke(
      'cmd',
      `code ${state.sysSetting.path}\\modules.json`,
    )
  }

  const reload = async () => {
    if (!state.sysSetting?.path) return
    const modules = await getModules(state.sysSetting.path)
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
              icon={<Icon type="edit" />}
              loading={loadings.edit}
              onClick={() => setLoadings(openConfFile(), 'edit')}
            />
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
        <div className="p" style={{ paddingTop: 10 }}>
          <div className="root-layout-home-view-modules-container overflow-y">
            {state?.modules?.map?.((item, i) => (
              <Module key={i} item={item} h={props.h} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
