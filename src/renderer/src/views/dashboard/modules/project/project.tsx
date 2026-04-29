import { Icon } from '@/components'
import { Button } from 'antd'
import { ProjectItem } from './project-item'
import { openConfFile } from './helper'
import { useSysStore } from '@/store/sys'
import { useTaskStore } from '@/store/task'
import './project.less'

export default function Dash_Project() {
  const sys = useSysStore()
  const task = useTaskStore()
  const { loadings } = task

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
            loading={loadings.project}
            onClick={() =>
              task.add({
                id: 'project__edit-json-file',
                name: 'Edit Project JSON File',
                async exec() {
                  return openConfFile(sys.path)
                },
              })
            }
          />
          <Button
            loading={loadings.nodeThread}
            icon={<Icon type="reload" style={{ fontSize: 16 }} />}
            onClick={() =>
              task.add({
                id: 'nodeThread__query',
                name: 'Query Node Thread',
                exec: sys.findNodeTreads,
              })
            }
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
