import React from 'react'
import { ProjectConf } from '@/type'
import { Button } from 'antd'
import { Icon } from '@/components'
import { isArray, isObject } from 'asura-eye'
import './project-item-content.less'
import { useProjectOpt } from './hook'
import { Space } from 'antd'

export const ProjectItemContent = (props: { item: ProjectConf }) => {
  const { item } = props
  const { projName, loadings, FSStatus, run, runGroup, stop, execTask } =
    useProjectOpt({ item })
  const { running, pid } = item
  const [show, setShow] = React.useState(false)
  const webs = Object.keys(item).filter(
    (key) => key.startsWith('url-') && key !== 'url-review',
  )

  const list = [
    [
      {
        className: 'run',
        icon: <Icon type="run" />,
        title: 'Run',
        onClick: run,
        loading: loadings.projectOpt__run || loadings.projectOptDependencies,
        disabled: FSStatus.node_modules === false,
        hidden: !item.npm || running,
      },
      {
        className: 'stop',
        icon: <Icon type="stop" />,
        onClick: stop,
        loading: loadings.projectOpt__stop || loadings.projectOptDependencies,
        title: 'Stop',
        hidden: !item.npm || !running,
      },
      {
        icon: <Icon type="google" />,
        title: 'Review',
        onClick: runGroup,
        hidden: !item['url-review'],
      },
      {
        loading: loadings.projectOpt__VSCode,
        icon: <Icon type="vscode" />,
        onClick: () => execTask('VSCode'),
        title: 'VS Code',
      },
      {
        className: 'run',
        icon: <Icon type="run-all" />,
        onClick: runGroup,
        title: 'All',
        hidden: FSStatus.node_modules === false || !item.npm || running,
        loading: loadings.projectOptRunGroup || loadings.projectOptDependencies,
      },
      {
        disabled: true,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M8 12h8M9 8H6a4 4 0 1 0 0 8h3m6-8h3a4 4 0 0 1 0 8h-3"
            ></path>
          </svg>
        ),
      },
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
        className: 'project-fold',
        'data-fold': show,
        icon: <Icon type="fold" />,
        onClick: () => setShow((v) => !v),
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
            onClick: () =>
              value &&
              execTask(
                'Web',
                value,
                `Open the ${projName} Project in ${label} Web`,
              ),
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
    <div className="project-item-content" data-start={running}>
      {isArray(pid) && pid.length > 0 && (
        <div className="pids">
          <div>PIDs:</div>
          {pid.map((p) => (
            <div key={p}>{p}</div>
          ))}
        </div>
      )}
      <div className="flex row gap wrap">
        {list.map((row, i) =>
          isArray(row) ? (
            <Space.Compact block key={i}>
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
  )
}
