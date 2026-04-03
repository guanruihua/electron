import React from 'react'
import { Icon } from '@/components'
import { ModuleProps, ProjectConf } from '@/type'
import { Button } from 'antd'
import { useLoadings } from '@/util'
import './operation.less'

export default function ProjectOperation(props: ModuleProps) {
  const { h } = props
  const { handle, state } = h
  const viewLoadings = h.loadings || {}

  const [loadings, setLoadings] = useLoadings({})

  const item: ProjectConf = state?.setting?.selectProject || {}
  const ref = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<NodeJS.Timeout | null>(null)

  const clear = () => {
    timer.current && clearInterval(timer.current)

    if (ref.current) ref.current.dataset.start = '0'
  }

  React.useEffect(() => {
    clear()
    const handle = () => {
      if (!item?.path) return timer.current && clearInterval(timer.current)
      const dataPath = item.path.replaceAll('\\', '>')
      const dom: HTMLDivElement | null = document.querySelector(
        `.opt-item[data-path='${dataPath}']`,
      )
      if ( !dom?.dataset?.start || !ref.current) return clear()
      if (ref.current.dataset.start !== dom.dataset.start)
        ref.current.dataset.start = dom.dataset.start
    }
    handle()
    timer.current = setInterval(handle, 3000)
    return clear
  }, [item.path])

  return (
    <div
      ref={ref}
      className="root-layout-home-view-modules project-operation"
      data-start="0"
    >
      <div className="module-bg" style={{ padding: 0 }}>
        <div
          className="flex space-between items-center mb"
          style={{ padding: '20px 20px 15px' }}
        >
          <h4 className="title">{item?.label || 'Project Operation'}</h4>
        </div>
        <div className="p" style={{ paddingTop: 10 }}>
          <div className="flex row gap wrap">
            <Button
              className="run"
              data-hidden={!item.npm}
              icon={<Icon type="run" />}
              loading={
                loadings.run || viewLoadings.stopAll || viewLoadings.findAll
              }
              onClick={() =>
                setLoadings(handle?.NodeThread?.dev?.(item, true), 'run')
              }
            >
              Run
            </Button>
            <Button
              className="stop"
              data-hidden={!item.npm}
              icon={<Icon type="stop" />}
              loading={
                loadings.stop || viewLoadings.stopAll || viewLoadings.findAll
              }
              onClick={() =>
                setLoadings(handle.NodeThread.stopModule(item, true), 'stop')
              }
            >
              Stop
            </Button>
            <Button
              loading={loadings.vscode}
              icon={<Icon type="vscode" />}
              onClick={() => {
                setLoadings(
                  window.api.invoke('cmd', `code ${item.path}`),
                  'vscode',
                )
              }}
            >
              VS Code
            </Button>
            {item.web && (
              <Button
                icon={<Icon type="google" />}
                loading={loadings.google}
                onClick={() =>
                  setLoadings(
                    window.api.invoke('cmd', `start chrome ${item.web}`),
                    'google',
                  )
                }
              >
                Google
              </Button>
            )}

            <Button
              icon={<Icon type="dir" />}
              loading={loadings.dir}
              onClick={() =>
                setLoadings(
                  window.api.invoke('cmd', `explorer "${item.path}"`),
                  'dir',
                )
              }
            >
              FRM
            </Button>

            {item?.build?.frontend && (
              <Button
                icon={<Icon type="build" />}
                className="text-10"
                onClick={() =>
                  item?.build?.frontend &&
                  window.api.invoke('cmd', `explorer "${item.build.frontend}"`)
                }
              >
                Front End
              </Button>
            )}
            {item?.build?.backend && (
              <Button
                icon={<Icon type="build" />}
                className="text-10"
                onClick={() =>
                  item?.build?.backend &&
                  window.api.invoke('cmd', `explorer "${item.build.backend}"`)
                }
              >
                Back End
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
