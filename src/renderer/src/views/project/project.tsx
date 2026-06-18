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
      {sys.modules?.map?.((item, i) => (
        <ProjectItem key={i} item={item} />
      ))}
    </ContentLayout>
  )
}
