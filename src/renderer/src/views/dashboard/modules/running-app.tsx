import { Icon } from '@/components'
import { ModuleProps } from '@/type'
import { useLoading } from '@/util'
import { Checkbox } from 'antd'
import { Button } from 'antd'
import { isArray, isString } from 'asura-eye'
import React from 'react'

type AppList = { name: string; id: string; title: string }[]

export default function RunningApp(props: ModuleProps) {
  const { state } = props.h
  const [loading, setLoading] = useLoading()
  const [selects, setSelects] = React.useState<string[]>([])
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
  const stop = async () => {
    await window.api.invoke(
      'stopAppByName',
      appList.filter((_) => selects.includes(_.id)).map((_) => _.name),
    )
    setSelects([])
    await init()
    return
  }
  const stopAll = async () => {
    await window.api.invoke(
      'stopAppByName',
      appList.map((_) => _.name),
    )
    setSelects([])
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
            <Button loading={loading} onClick={() => setLoading(stopAll())}>
              Stop All
            </Button>
            <Button
              disabled={!selects.length}
              loading={loading}
              onClick={() => setLoading(stop())}
            >
              Stop Select
            </Button>
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
            className="flex col gap p border-radius"
            style={{ background: '#000' }}
          >
            {appList.map((item) => {
              const { id } = item
              return (
                <Checkbox
                  key={id}
                  checked={selects.includes(id)}
                  onClick={() =>
                    setSelects((list) =>
                      list.includes(id)
                        ? list.filter((_) => _ != id)
                        : [id, ...list],
                    )
                  }
                >
                  {item.title} ({item.name})
                </Checkbox>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
