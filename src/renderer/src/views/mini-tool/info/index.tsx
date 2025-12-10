import React from 'react'
import { uesPageState } from '../state'
import { AppCard } from '../components'
import RandomPwd from '@/views/tools/random-pwd'
import { Button } from 'aurad'
import { StartMenu } from '@/views/startMenu'

export interface InfoProps {
  [key: string]: any
}

export function Info(props: InfoProps) {
  const h = uesPageState()
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!ref.current) return
    const dom: HTMLDivElement = ref.current
    const set = (rect) => {
      const { width, height } = rect || {}
      const w = Math.max(800, width)
      const h = height + 120
      const val = {
        width: w,
        height: h,
      }
      window.api.setSize(val)
    }
    const observer = new ResizeObserver((entries) => {
      set(entries?.[0]?.contentRect)
    })
    observer.observe(dom)
    return () => {
      observer.unobserve(dom)
    }
  }, [ref.current])
  return (
    <div ref={ref} className="page__miniTool-container-info">
      <div className="page__miniTool-container-info-container">
        {/* <RandomPwd /> */}
        <StartMenu />
        <div className="app-list">
          <AppCard
            name="test"
            onClick={async () => {
              let res: any = ''
              // const res = await window.api.test({ a: 123, })
              res = await window.api.invoke('store', {
                type: 'get',
                payload: { a: 123 },
              })
              console.log('test:', res)
            }}
          />
          <AppCard
            name="test2"
            onClick={async () => {
              let res = ''
              //  res = await window.api.test({ a: 123, })
              //  res = window.api.getAppPath()
              console.log('test:', res)
            }}
          />

        </div>
      </div>
    </div>
  )
}
