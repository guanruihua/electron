import React from 'react'
import { Button } from 'antd'
import { ModuleProps } from '../../type'
import { isFunction, isString } from 'asura-eye'
import { useLoading } from '@/util'

const MyButton = ({ child }: { child: [string, string | any] }) => {
  const [name, cmd] = child
  const title: string = isString(cmd) ? `${name} - ${cmd}` : name
  const [loading, setLoading] = useLoading()
  const click = async () => {
    if (isString(cmd)) return window.api.invoke('cmd', cmd)
    if (isFunction(cmd)) return cmd()
    return
  }
  return (
    <Button
      loading={loading}
      title={title}
      onClick={() => {
        setLoading(click())
      }}
    >
      {name}
    </Button>
  )
}

export function Opt(props: ModuleProps) {
  const { handle } = props.h
  const Conf: {
    title: string
    children: [string, string | any][]
  }[] = [
    {
      title: 'System',
      children: [
        ['最大化', handle.max],
        ['最小化', handle.min],
        ['关闭 ', handle.close],
        ['打开遮罩', window.api.openMaskWindow],
        ['Devtool', handle.openDevtool],
        ['Reload', handle.reload],
      ],
    },
    {
      title: 'Nginx',
      children: [
        ['Start', 'cd D:\\env\\nginx\\nginx-1.28.2 && start .\\nginx.exe'],
        ['Stop', 'taskkill /F /IM nginx.exe'],
        [
          'Restart',
          'taskkill /F /IM nginx.exe && cd D:\\env\\nginx\\nginx-1.28.2 && start .\\nginx.exe',
        ],
        ['Reload', 'cd D:\\env\\nginx\\nginx-1.28.2 && .\\nginx.exe -s reload'],
        ['Edit Conf', 'code D:\\env\\nginx\\nginx-1.28.2\\conf\\nginx.conf'],
      ],
    },
    {
      title: 'Win11',
      children: [
        ['Edit Hosts', 'code C:\\Windows\\System32\\drivers\\etc\\hosts'],
      ],
    },
  ]

  return (
    <div className="root-layout-home-view-opt flex col justify-center overflow-y module-bg">
      <h4 className="mb">OPT</h4>
      <div className="flex gap wrap" style={{ paddingTop: 20 }}>
        {Conf.map((item, i) => {
          const { title, children } = item
          return (
            <React.Fragment key={i}>
              <div className="title">{title}</div>
              {children?.map((child, j) => (
                <MyButton key={j} child={child} />
              ))}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
