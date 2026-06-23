import { ProjectConf } from '@/type'
import { useSysStore } from '@/store/sys'
import React from 'react'
import { GitReview } from './git-review/git-review'
import { Icon } from '@/components'
import { Button } from 'antd'
import { isArray, isObject } from 'asura-eye'
import './project-item-content.less'
import { useProjectOpt } from './hook'
import { Space } from 'antd'
import { useTaskStore } from '@/store/task'

export const ProjectItem = (props: { item: ProjectConf }) => {
  const sys = useSysStore()
  const task = useTaskStore()
  const { item } = props
  const name = item.label || item.path
  const { loadings } = task
  const params = { item, sys, task }
  const { FSStatus, run, runGroup, stop, execTask } = useProjectOpt(params)
  const { running, pid } = item

  const [show, setShow] = React.useState(false)
  const [showGit, setShowGit] = React.useState(false)
  const [fold, setFold] = React.useState(true)

  const webs = Object.keys(item).filter(
    (key) => key.startsWith('url-') && key !== 'url-review',
  )

  const Header = [
    {
      className: 'run',
      icon: <Icon type="run-all" />,
      onClick: runGroup,
      title: 'All',
      hidden: FSStatus.node_modules === false || !item.npm || running,
      loading: loadings.projectOptRunGroup || loadings.projectOptDependencies,
    },
    {
      className: 'run',
      icon: <Icon type="run" />,
      title: 'Run',
      onClick: run,
      loading: loadings['projectOpt/run'] || loadings.projectOptDependencies,
      disabled: FSStatus.node_modules === false,
      hidden: !item.npm || running,
    },
    {
      className: 'stop',
      icon: <Icon type="stop" />,
      onClick: stop,
      loading: loadings['projectOpt/stop'] || loadings.projectOptDependencies,
      title: 'Stop',
      hidden: !item.npm || !running,
    },
    {
      icon: <Icon type="google" />,
      title: 'Review',
      onClick: () => execTask('Web'),
      hidden: !item['url-review'],
    },
    {
      loading: loadings['projectOpt/VSCode'],
      icon: <Icon type="vscode" />,
      onClick: () => execTask('VSCode'),
      title: 'VS Code',
    },
  ].filter((_) => !_.hidden)

  const list = [
    [
      {
        loading: loadings.projectOpt__Cmd,
        icon: <Icon type="cmd" />,
        onClick: () => execTask('Cmd'),
        title: 'Cmd',
      },
      {
        loading: loadings.projectOpt__FRM,
        icon: <Icon type="dir" />,
        onClick: () => execTask('FRM'),
        title: 'FRM',
      },
      {
        className: 'project-git',
        'data-show-git': showGit,
        icon: <Icon type="git" />,
        onClick: () => setShowGit((v) => !v),
        hidden: item.git === false,
      },
      {
        className: 'project-fold',
        'data-fold': show,
        icon: <Icon type="fold" />,
        onClick: () => setShow((v) => !v),
        hidden: !webs?.length && !FSStatus['package.json'],
      },
    ].filter((_) => !_.hidden),
    show &&
      webs?.length && [
        {
          disabled: true,
          icon: <Icon type="google" />,
        },
        ...webs.map((key) => {
          const value = item[key]
          const tmp = key.replace('url-', '')
          const label = tmp.slice(0, 1).toUpperCase() + tmp.slice(1)
          return {
            className: 'text-10',
            'data-key': key,
            loading: loadings[`projectOpt__Web-${value}`],
            onClick: () => value && execTask('Web', value),
            label,
          }
        }),
      ],
    show &&
      FSStatus['package.json'] && [
        {
          disabled: true,
          icon: <Icon type="install" />,
        },
        {
          'data-type': 'install',
          disabled: FSStatus.node_modules === true,
          loading: loadings.projectOptDependencies,
          className: 'project-item-content-module-child-item',
          onClick: () => execTask('install'),
          label: 'Install',
        },
        {
          'data-type': 'reinstall',
          disabled: FSStatus.node_modules === false,
          loading: loadings.projectOptDependencies,
          className: 'project-item-content-module-child-item',
          onClick: () => execTask('reinstall'),
          label: 'Reinstall',
        },
        {
          'data-type': 'uninstall',
          disabled: FSStatus.node_modules === false,
          loading: loadings.projectOptDependencies,
          className: 'project-item-content-module-child-item',
          onClick: () => execTask('uninstall'),
          label: 'Uninstall',
        },
      ],
  ].filter(Boolean)

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
      <div className="project-item-header">
        <div
          className="project-item-name"
          onClick={() => {
            setFold((v) => !v)
            sys.handleSelectProject(item)
          }}
        >
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
            <div className="flex row gap wrap" style={{ gap: 5, marginTop: 5 }}>
              {list.map((row, i) =>
                isArray(row) ? (
                  <Space.Compact
                    style={{ justifyContent: 'flex-start' }}
                    block
                    key={i}
                  >
                    {row.map((item, j) => {
                      if (!isObject(item)) return <React.Fragment key={j} />
                      const { label, ...rest }: any = item
                      return (
                        <Button key={j} {...rest}>
                          {label}
                        </Button>
                      )
                    })}
                  </Space.Compact>
                ) : (
                  <React.Fragment key={i} />
                ),
              )}
            </div>
          </div>
          {showGit && <GitReview item={item} />}
        </div>
      )}
    </div>
  )
}
