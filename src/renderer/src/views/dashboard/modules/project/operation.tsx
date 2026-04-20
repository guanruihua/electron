import React from 'react'
import { Icon } from '@/components'
import { ModuleProps, ProjectConf } from '@/type'
import { Button } from 'antd'
import { sleep, useLoadings } from '@/util'
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
    setLoadings(false)
    if (ref.current) ref.current.dataset.start = '0'
  }

  const load = () => {
    if (!item?.path) return timer.current && clearInterval(timer.current)
    const dataPath = item.path.replaceAll('\\', '>')
    const dom: HTMLDivElement | null = document.querySelector(
      `.opt-item[data-path='${dataPath}']`,
    )
    if (!dom?.dataset?.start || !ref.current) return clear()
    if (ref.current.dataset.start !== dom.dataset.start)
      ref.current.dataset.start = dom.dataset.start
  }
  const init = () => {
    clear()
    load()
    timer.current = setInterval(load, 3000)
  }
  React.useEffect(() => {
    init()
    return clear
  }, [item.path])

  const runningLoading =
    loadings.stop ||
    loadings.run ||
    viewLoadings.stopAll ||
    viewLoadings.findAll

  return (
    <div ref={ref} className="project-operation" data-start="0">
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
              loading={runningLoading}
              onClick={async () => {
                setLoadings(true, 'run')
                await handle?.NodeThread?.dev?.(item, true)
                init()
                await sleep(3000)
                setLoadings(false, 'run')
              }}
            >
              Run
            </Button>
            <Button
              className="stop"
              data-hidden={!item.npm}
              icon={<Icon type="stop" />}
              loading={runningLoading}
              onClick={async () => {
                setLoadings(true, 'stop')
                await handle.NodeThread.stopModule(item, true)
                await sleep(3000)
                setLoadings(false, 'stop')
              }}
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
            <Button
              loading={loadings.cmd}
              icon={<Icon type="cmd" />}
              onClick={() => {
                setLoadings(
                  window.api.invoke(
                    'cmd',
                    `start cmd /k "cd /d \"${item.path}\""`,
                  ),
                  'cmd',
                )
              }}
            >
              CMD
            </Button>
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

            {Object.keys(item)
              .filter((key) => key.startsWith('url-'))
              .map((key) => {
                const value = item[key]
                const tmp = key.replace('url-', '')
                const label = tmp.slice(0, 1).toUpperCase() + tmp.slice(1)
                return (
                  <Button
                    key={key}
                    icon={<Icon type="google" />}
                    className="text-10"
                    data-key={key}
                    onClick={() =>
                      value && window.api.invoke('cmd', `explorer "${value}"`)
                    }
                  >
                    {label}
                  </Button>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
