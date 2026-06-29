import { ContentLayout } from '@/components/layout'

import { ProjectItem } from './project/project-item'
import { useSysStore } from '@/store/sys'
import { useTaskStore } from '@/store/task'
import { ProjectHeader } from './header'

import './project.less'
import { likeValue } from '@/util'

export default function Project() {
  const sys = useSysStore()
  const task = useTaskStore()
  const { userInfo } = sys

  const url_jenkins = 'https://jenkins.yessafe.com.cn'
  const list = sys.modules.filter((item) => {
    if (
      item?.['url-backend']?.indexOf(url_jenkins) === 0 ||
      item?.['url-frontend']?.indexOf(url_jenkins) === 0
    )
      return true
    return false
  })

  console.log(list)

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
