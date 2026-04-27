import { Icon } from '@/components'
import { ModuleProps } from '@/type'
import { Button } from 'antd'
import { useLoadings } from '@/util'
import { ProjectItem } from './project-item'
import { openConfFile } from './helper'
import './project.less'
import { useSysStore } from '@/store/sys'

export default function ProjectDashboard(props: ModuleProps) {
  const sys = useSysStore()
  const { h } = props
  const { handle, state } = h
  const viewLoadings = h.loadings || {}

  const [loadings, setLoadings] = useLoadings({
    edit: false,
    reload: false,
  })

  const reload = async () => {
    handle.setLoadings(handle.findAll_NodeThread(), 'findAll')
  }

  return (
    <div className="dashboard-project">
      <div
        className="flex space-between items-center mb"
        style={{ padding: '20px 20px 0' }}
      >
        <h4>Project</h4>
        <div className="flex gap">
          <Button
            icon={<Icon type="edit" />}
            loading={loadings.edit}
            onClick={() => setLoadings(openConfFile(state), 'edit')}
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
        <div className="dashboard-project-container overflow-y">
          {sys?.modules?.map?.((item, i) => (
            <ProjectItem key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
