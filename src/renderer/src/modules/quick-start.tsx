import React from 'react'
import { Button } from 'antd'
import { isArray, isString } from 'asura-eye'
import { getCache, invoke, setCache, useLoading } from '@/util'
import { Icon } from '@/components'
import { useSysStore } from '@/store/sys'

const path = 'D:\\Data\\electron\\quick-start'
const uid = 'quick-start'

export const QuickStart = () => {
  const sys = useSysStore()

  const [loading, setLoading] = useLoading()
  const [renderList, setRenderList] = React.useState<any[]>([])

  const init = async () => {
    setLoading(true)
    try {
      const cache = await getCache({ uid })
      const { data, time } = cache.at(0)
      // console.log(cache)
      if (isArray(data) && Date.now() - time < 3000) {
        setRenderList(data)
        return
      }
      const res = await invoke('fs', {
        action: 'readCurrentDir',
        payload: {
          path,
        },
      })
      // console.log(res)
      if (isArray(res)) {
        setRenderList(res)
        await setCache({
          uid,
          data: res,
          time: Date.now(),
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const startAll = async () => {
    setLoading(true)
    try {
      renderList.forEach(async (item) => {
        const { path } = item
        if (!path) return
        await invoke('cmd', path)
      })
    } finally {
      setLoading(false)
    }
  }
  React.useEffect(() => {
    init()
  }, [])

  return (
    <div
      className="dash-quickStart layout-module"
      data-disabled={!sys.initSuccess}
    >
      <div className="flex space-between items-center">
        <h4>Quick Start</h4>
        <div className="flex gap bold text-12 items-center">
          <Button
            icon={<Icon type="run" />}
            loading={loading}
            disabled={!renderList?.length}
            className="bold"
            onClick={startAll}
          >
            Start All
          </Button>
          <Button
            icon={<Icon type="edit" />}
            loading={loading}
            onClick={() => invoke('cmd', `explorer "${path}"`)}
          />
          <Button
            icon={<Icon type="reload" />}
            loading={loading}
            onClick={init}
          />
        </div>
      </div>
      <div className="dash-quickStart-container grid overflow-y gap">
        <div className="quickStart-app-container flex row gap">
          {renderList.map((item, i) => {
            const { name, path } = item
            if (!isString(path) || !path) return <React.Fragment key={i} />
            return (
              <div
                className="quickStart-app"
                key={path}
                onClick={() => {
                  window.api.invoke('cmd', `start "" "${path}"`)
                }}
              >
                {name?.replace('.lnk', '')}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
