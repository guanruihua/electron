import React from 'react'
import { useLayoutStore } from '@/store/layout'
import { isChange } from '@/util'
import { Div } from 'aurad'
import { ClassNameType } from 'harpe'
import './index.less'
import { getCfg } from './helper'

export interface LayoutProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className'
> {
  name: string
  className?: ClassNameType
  children: React.ReactNode
  [key: string]: any
}

export function ContentLayout(props: LayoutProps) {
  const { name, className, children, ...rest } = props
  const len = React.Children.count(children)

  const ly = useLayoutStore()
  const cfg = ly.contentLayout[name] || [
    {
      total: 1,
      show: [-1],
    },
  ]

  const [lastUpdate, setLastUpdate] = React.useState(-1)
  const [w, setW] = React.useState(-1)

  const init = () => {
    const newInnerWidth = Math.floor((window.innerWidth / 10) * 10)
    const newCol = Math.min(Math.floor((newInnerWidth - 50) / 420), 10)
    ly.innerCol !== newCol && ly.set({ innerCol: newCol })
    const newCfg = getCfg(len, newCol)

    isChange(newCfg, ly.contentLayout?.[name]) &&
      ly.setContentLayout(name, newCfg)
  }

  const timer = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    const newInnerWidth = Math.floor((window.innerWidth / 10) * 10)
    if (w !== newInnerWidth) {
      setW(newInnerWidth)
      init()
    }
  }, [lastUpdate, children, w])

  React.useEffect(() => {
    timer.current && clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setLastUpdate(Date.now())
      timer.current && clearTimeout(timer.current)
    }, 500)

    return () => {
      timer.current && clearTimeout(timer.current)
    }
  }, [lastUpdate, children, len])

  const cols = new Array(ly.innerCol).fill('')

  return (
    <Div className={['layout-grid', className]} {...rest}>
      {cols.map((_, i) => {
        const { show = [] } = cfg?.[i] || {}
        return (
          <div key={i} className="layout-grid-col flex col gap">
            {React.Children.map(children, (item, j) => {
              if (show.includes(j) || show.at(0) === -1)
                return (
                  <div key={j} className="layout-grid-item" data-index={j}>
                    {item}
                  </div>
                )
              return <React.Fragment key={j} />
            })}
          </div>
        )
      })}
      <div className="layout-grid-col layout-grid-bg">
        {React.Children.map(children, (item, j) => (
          <div key={j} className="layout-grid-item" data-index={j}>
            {item}
          </div>
        ))}
      </div>
    </Div>
  )
}
