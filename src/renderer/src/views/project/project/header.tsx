import { Icon } from '@/components'
import { Button } from 'antd'

export interface ProjectHeaderProps {
  [key: string]: any
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const { sys, task } = props
  const { loadings } = task

  return (
    <div className="project-header">
      {/* <h4>Project</h4> */}
      <h4></h4>
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
  )
}
