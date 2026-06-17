import { ProjectConf } from '@/type'
import { useSysStore } from '@/store/sys'
import React from 'react'
import { ProjectItemContent } from './project-item-content'
import { GitReview } from './git-review/git-review'

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              width="1em"
              height="1em"
            >
              <path
                fill="currentColor"
                stroke="currentColor"
                stroke-width="48"
                stroke-linejoin="round"
                d="M831.872 340.864 512 652.672 192.128 340.864a30.59 30.59 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.59 30.59 0 0 0-42.752 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {!fold && <div className="project-item-content">
        <ProjectItemContent item={item} />
        <GitReview item={item}/>
      </div>}
    </div>
  )
}
