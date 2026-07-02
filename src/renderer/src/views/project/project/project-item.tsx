import React from 'react'
import { ProjectConf } from '@/type'
import { GitReview } from './git-review/git-review'
import { Button, Space } from 'antd'
import { isArray, isObject } from 'asura-eye'
import { useTaskStore } from '@/store/task'
import { useWebViewStore } from '@/views/hot/store'
import { JenkinsView } from './jenkins'
import { getConf } from './conf'
import { HandleRow } from './handle-row'
import './project-item.less'
import { useProjStore } from '../store'

export const ProjectItem = (props: { item: ProjectConf }) => {
  const wv = useWebViewStore()
  const task = useTaskStore()
  const p = useProjStore()

  const { item } = props
  const { label, path, pid, Jenkins, running } = item
  const { frontend_status, backend_status, url_frontend, url_backend } =
    Jenkins || {}
  const name = label || path
  const { loadings } = task

  const [showGit, setShowGit] = React.useState(false)
  const [fold, setFold] = React.useState(true)

  const { list, Header, FS_List, Webs_List } = getConf({
    p,
    task,
    loadings,
    item,
    showGit,
    setShowGit,
    wv,
  })

  return (
    <div
      className="project-item"
      data-path={item?.path?.replaceAll('\\', '>')}
      data-start={item.running ? 1 : 0}
      data-pid
      title={item.label || item.path}
      data-fold={fold}
    >
      <div className="project-item-header">
        <div className="project-item-name" onClick={() => setFold((v) => !v)}>
          {name}
        </div>

        <div className="project-item-right">
          <Space.Compact block>
            {Header.map((item, j) => {
              if (!isObject(item)) return <React.Fragment key={j} />
              const { label, ...rest }: any = item
              return <Button key={j} {...rest} />
            })}
          </Space.Compact>
        </div>
        <div className="project-item-header-badge">
          {url_frontend && <div data-status={frontend_status}>Frontend</div>}
          {url_backend && <div data-status={backend_status}>Backend</div>}
        </div>
      </div>
      {!fold && (
        <div className="project-item-content">
          <div className="project-item-content-header" data-start={running}>
            {isArray(pid) && pid.length > 0 && (
              <div className="pids">
                <div>PIDs:</div>
                {pid.map((p) => (
                  <div key={p}>{p}</div>
                ))}
              </div>
            )}
            <HandleRow row={list} />
            <HandleRow row={FS_List} />
            <HandleRow row={Webs_List} />
            <JenkinsView item={item} />
          </div>
          {showGit && <GitReview item={item} />}
        </div>
      )}
    </div>
  )
}
