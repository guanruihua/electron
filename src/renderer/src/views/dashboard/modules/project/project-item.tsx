import React from 'react'
import { ModuleProps, ProjectConf } from '@/type'
import { isString } from 'asura-eye'

export const ProjectItem = (props: ModuleProps & { item: ProjectConf }) => {
  const { h, item } = props
  const { handle } = h

  if (isString(item?.type) && item.type.toLowerCase() === 'group')
    return (
      <React.Fragment>
        <div
          style={{
            borderBottom: '2px solid rgba(255,255,255, .2)',
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
              <ProjectItem key={i} item={item} h={props.h} />
            ))}
          </div>
        </div>
      </React.Fragment>
    )

  return (
    <div
      className="opt-item flex"
      data-path={item?.path?.replaceAll('\\', '>')}
      data-start
      data-pid
      title={item.label || item.path}
      data-select={h?.state?.setting?.selectProject?.path === item?.path}
    >
      <span
        className="opt-item-name bold pointer"
        onClick={() => handle.selectProject(item)}
      >
        {item.label || item.path}
      </span>
    </div>
  )
}
