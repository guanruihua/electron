import { ContentLayout } from '@/components/layout'

import { ProjectItem } from './project/project-item'
import { useSysStore } from '@/store/sys'
import { useTaskStore } from '@/store/task'
import { ProjectHeader } from './header'

import './project.less'
import { useProjStore } from './store'
import React from 'react'

export default function Project() {
  const sys = useSysStore()
  const task = useTaskStore()
  const p = useProjStore()

  React.useEffect(() => {
    sys.initSuccess && p.init()
  }, [sys.initSuccess])

  return (
    <ContentLayout
      name="root-project"
      className="project"
      key={sys.modules.length}
    >
      <ProjectHeader sys={sys} task={task} />
      {p.projects?.map?.((item) => (
        <ProjectItem key={item.path} item={item} />
      ))}
    </ContentLayout>
  )
}
