import { ContentLayout } from '@/components/layout'

import { ProjectItem } from './project/project-item'
import { useSysStore } from '@/store/sys'
import { useTaskStore } from '@/store/task'
import { ProjectHeader } from './project/header'

import './project.less'

export default function Project() {
  const sys = useSysStore()
  const task = useTaskStore()

  // console.log(sys.modules)
  
  return (
    <ContentLayout
      name="root-project"
      className="project"
      key={sys.modules.length}
    >
      <ProjectHeader sys={sys} task={task} />
      {sys.modules?.map?.((item, i) => {
        if (item.type !== 'group') return <ProjectItem key={i} item={item} />
        return (
          <div className="project-group" key={i}>
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
        )
      })}
    </ContentLayout>
  )
}
