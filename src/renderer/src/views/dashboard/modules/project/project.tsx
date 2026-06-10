import { Icon } from '@/components'
import { Button } from 'antd'
import { ProjectItem } from './project-item'
import { useSysStore } from '@/store/sys'
import { useTaskStore } from '@/store/task'
import './project.less'

export default function Dash_Project() {
  const sys = useSysStore()
  const task = useTaskStore()
  const { loadings } = task

  return (
    <div className="dashboard-project">
      <div className="dashboard-project-header flex space-between items-center p">
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
                  return await window.api.invoke(
                    'cmd',
                    `code ${sys.path}\\modules.json`,
                  )
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
      <div className="dashboard-project-container">
        <div className="dashboard-project-group">
          {sys?.modules
            ?.filter((_) => _?.type?.toLowerCase() !== 'group')
            ?.map?.((item, i) => {
              return <ProjectItem key={i} item={item} />
            })}
        </div>
        {sys?.modules
          ?.filter((_) => _?.type?.toLowerCase() === 'group')
          ?.map?.((item, i) => {
            return (
              <div className="dashboard-project-group" key={i}>
                <div
                  style={{
                    marginBottom: 10,
                    marginTop: 5,
                  }}
                />
                <div>
                  <div className="bold text-12 pointer border-bottom">
                    {item.label || item.path}
                  </div>
                  <div
                    className="grid-layout grid"
                    style={{
                      marginTop: 5,
                    }}
                  >
                    {item.children?.map?.((item, i) => (
                      <ProjectItem key={i} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
