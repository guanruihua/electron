import { ContentLayout } from '@/components/layout'

import { ProjectItem } from './project/project-item'
import { useSysStore } from '@/store/sys'
import { useTaskStore } from '@/store/task'
import { ProjectHeader } from './project/header'

import './project.less'
import { likeValue } from '@/util'

export default function Project() {
  const sys = useSysStore()
  const task = useTaskStore()
  const { userInfo } = sys

  return (
    <ContentLayout
      name="root-project"
      className="project"
      key={sys.modules.length}
    >
      <ProjectHeader sys={sys} task={task} />
      {sys.modules
        ?.filter((_) =>
          userInfo.setting?.filterModule
            ? likeValue(userInfo.setting.filterModule, _.label)
            : true,
        )
        ?.map?.((item) => (
          <ProjectItem key={item.path} item={item} />
        ))}
    </ContentLayout>
  )
}
