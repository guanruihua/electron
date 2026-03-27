import { Icon } from '@/components'
import { ModuleProps } from '@/type'
import { useLoading, useLoadings } from '@/util'
import { Button } from 'antd'
import { isArray, isString } from 'asura-eye'
import React from 'react'

type AppList = { name: string; id: string; title: string }[]

export default function RunningApp(props: ModuleProps) {
  const { state } = props.h
  const [loadings, setLoadings] = useLoadings()
  const [loading, setLoading] = useLoading()
  const [appList, setAppList] = React.useState<AppList>([])

  const init = async () => {
    const res = await window.api.invoke('getRunningApp')
    // console.log(res)
    if (!isArray(res)) return
    const ignoreApps = state.setting?.ignoreApps
    const ignoreNames = ignoreApps?.split(',').map((_) => _.trim())
    const newAppList = ignoreNames?.length
      ? res.filter((_) => {
          if (!isString(_.name)) return
          for (let i = 0; i < ignoreNames.length; i++)
            if (_.name.indexOf(ignoreNames[i]) > -1) return false
          return true
        })
      : res

    setAppList(newAppList)
  }
  const stop = async (item) => {
    if (!isString(item?.name)) return
    await window.api.invoke(
      'stopAppByName',
      item.name,
      // appList.filter((_) => selects.includes(_.id)).map((_) => _.name),
    )
    await init()
    return
  }
  const stopAll = async () => {
    await window.api.invoke(
      'stopAppByName',
      appList.map((_) => _.name),
    )
    await init()
    return
  }

  React.useEffect(() => {
    init()
  }, [])

  return (
    <div className="root-layout-home-view-running-app">
      <div className="module-bg" style={{ padding: 0 }}>
        <div
          className="flex space-between items-center mb"
          style={{ padding: '20px 20px 0' }}
        >
          <h4>Running App</h4>
          <div className="flex gap">
            <Button
              icon={<Icon type="stop" />}
              loading={loading}
              onClick={() => setLoading(stopAll())}
            >
              Stop All
            </Button>
            {/* <Button
              icon={<Icon type="stop" />}
              disabled={!selects.length}
              loading={loading}
              onClick={() => setLoading(stop())}
            >
              Stop Select
            </Button> */}
            <Button
              loading={loading}
              icon={<Icon type="reload" style={{ fontSize: 16 }} />}
              className="bolder"
              onClick={() => setLoading(init())}
            />
          </div>
        </div>
        <div className="p">
          <div
            className="flex col p border-radius"
            style={{
              background: '#000',
              minHeight: 80,
              justifyContent: 'center',
            }}
          >
            {appList.length ? (
              appList.map((item) => {
                const { id } = item
                return (
                  <div
                    key={id}
                    className="grid gap"
                    style={{
                      gridTemplateColumns: '1fr auto',
                      alignItems: 'center',
                    }}
                  >
                    <div className="text-14">
                      {item.title} ({item.name})
                    </div>
                    <Icon
                      loading={loadings[item.id]}
                      type="stop"
                      className="opt stop"
                      style={{ fontSize: 24 }}
                      onClick={() => setLoadings(stop(item), item.id)}
                    />
                  </div>
                )
              })
            ) : (
              <div className="text-center">Empty</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
