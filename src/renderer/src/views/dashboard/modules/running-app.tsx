import { Icon } from '@/components'
import { useSysStore } from '@/store/sys'
import { useTaskStore } from '@/store/task'
import { Button } from 'antd'
import { isArray, isString } from 'asura-eye'
import React from 'react'

type AppList = { name: string; id: string; title: string }[]

export default function RunningApp() {
  const sys = useSysStore()
  const task = useTaskStore()
  const { loadings } = task
  const [appList, setAppList] = React.useState<AppList>([])

  const query = () =>
    task.add({
      id: 'runningApp__query',
      name: 'Query All Running Apps',
      async exec() {
        const res = await window.api.invoke('getRunningApp')
        if (!isArray(res)) return
        const ignoreNames =
          sys?.ignoreApps?.split(',').map((_) => _.trim()) || []

        const newAppList = ignoreNames?.length
          ? res.filter((_) => {
              if (!isString(_.name)) return
              for (let i = 0; i < ignoreNames.length; i++)
                if (_.name.indexOf(ignoreNames[i]) > -1) return false
              return true
            })
          : res

        setAppList(newAppList)
        return
      },
    })

  const stop = async (item) => {
    if (!isString(item?.name)) return

    task.add({
      id: `runningApp__stop-${item.id}`,
      name: `Running App / Stop the ${item.name} App(${item.id})`,
      async exec() {
        return await window.api.invoke('stopAppByName', item.name)
      },
    })

    query()
    return
  }
  const stopAll = async () => {
    task.add({
      id: `runningApp__stopAll`,
      name: `Stop All Running Apps`,
      async exec() {
        return await window.api.invoke(
          'stopAppByName',
          appList.map((_) => _.name),
        )
      },
    })
    query()
    return
  }
  React.useEffect(() => {
    query()
  }, [])

  return (
    <div className="dash-running-app dash-bg">
      <div
        className="flex space-between items-center"
        style={{ padding: '20px 20px 0' }}
      >
        <h4>Running App</h4>
        <div className="flex gap">
          <Button
            icon={<Icon type="stop" />}
            loading={loadings.runningApp__stopAll}
            onClick={stopAll}
          >
            Stop All
          </Button>
          <Button
            loading={loadings.runningApp__query}
            icon={<Icon type="reload" style={{ fontSize: 16 }} />}
            onClick={query}
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
                  <div className="text-12">
                    {item.title} ({item.name})
                  </div>
                  <Icon
                    loading={loadings[`runningApp__stop-${item.id}`]}
                    type="stop"
                    className="opt stop"
                    style={{ fontSize: 24 }}
                    onClick={() => stop(item)}
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
  )
}
