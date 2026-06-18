import { ProjectConf } from '@/type'
import { useSysStore } from '@/store/sys'
import React from 'react'
import { ProjectItemContent } from './project-item-content'
import { GitReview } from './git-review/git-review'
import { Icon } from '@/components'

export const ProjectItem = (props: { item: ProjectConf }) => {
  const sys = useSysStore()
  const { item } = props
  const name = item.label || item.path
  // console.log(item)
  const [fold, setFold] = React.useState(true)

  return (
    <div
      className="project-item"
      data-path={item?.path?.replaceAll('\\', '>')}
      data-start={item.running ? 1 : 0}
      data-pid
      title={item.label || item.path}
      data-select={sys?.selectProject?.path === item?.path}
      data-fold={fold}
    >
      <div
        className="project-item-header"
        onClick={() => {
          setFold((v) => !v)
          sys.handleSelectProject(item)
        }}
      >
        <span className="project-item-name">{name}</span>
        <div className="project-item-right">
          <div className="project-item-fold">
            <Icon type="fold" />
          </div>
        </div>
      </div>

      {!fold && (
        <div className="project-item-content">
          <ProjectItemContent item={item} />
          <GitReview item={item} />
        </div>
      )}
    </div>
  )
}
