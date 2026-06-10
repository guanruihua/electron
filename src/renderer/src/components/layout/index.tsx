import { useLayoutStore } from '@/store/layout'
import { isChange } from '@/util'
import { Div } from 'aurad'
import { ClassNameType } from 'harpe'
import React from 'react'

export interface LayoutProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className'
> {
  name: string
  className?: ClassNameType
  children: React.ReactNode
  [key: string]: any
}

const getHeight = (children: React.ReactNode, col: number = 1) => {
  const len = React.Children.count(children)

  const cfg: {
    total: number
    show: number[]
  }[] = new Array(col).fill('').map((_) => ({
    total: 0,
    show: [],
  }))
  if (col < 2) {
    return [
      {
        total: 1,
        show: new Array(len).fill('').map((_, i) => i ),
      },
    ]
  }
  if (len <= col) {
    return cfg.map((item, i) => {
      item.total = 1
      item.show = [i]
      return item
    })
  }

  const getMinIndex = () => {
    let min = -1
    let index = -1
    for (let i = 0; i < cfg.length; i++) {
      const total = cfg[i].total
      if (total === 0) return i
      if (index === -1 || total < min) {
        min = total
        index = i
        continue
      }
    }
    return index || 0
  }

  for (let i = 0; i < len; i++) {
    const dom = document.querySelector(
      `.layout-grid>.layout-grid-col>.layout-grid-item[data-index="${i}"]`,
    )
    if (dom) {
      const h = dom.getBoundingClientRect().height
      const index = getMinIndex()
      cfg[index].total += h
      cfg[index].show.push(i)
    }
  }

  return cfg
}

export function ContentLayout(props: LayoutProps) {
  const { name, className, children, ...rest } = props

  const ly = useLayoutStore()
  const cfg = ly.contentLayout[name] || [
    {
      total: 1,
      show: [-1],
    },
  ]

  const [lastUpdate, setLastUpdate] = React.useState(-1)

  const init = () => {
    const newCol = Math.min(Math.floor((window.innerWidth - 50) / 420), 3)
    ly.innerCol !== newCol && ly.set({ innerCol: newCol })
    const newCfg = getHeight(children, newCol)

    // console.log(
    //   className,
    //   window.innerWidth,
    //   newCol,
    //   newCfg.map((_) => _.total),
    //   newCfg.map((_) => _.show.join()),
    // )
    isChange(newCfg, ly.contentLayout?.[name]) &&
      ly.setContentLayout(name, newCfg)
  }

  const timer = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    init()
    timer.current && clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setLastUpdate(Date.now())
      timer.current && clearTimeout(timer.current)
    }, 2000)

    return () => {
      timer.current && clearTimeout(timer.current)
    }
  }, [lastUpdate])

  return (
    <Div className={['layout-grid', className]} {...rest}>
      {new Array(ly.innerCol).fill('').map((_, i) => {
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
    </Div>
  )
}
