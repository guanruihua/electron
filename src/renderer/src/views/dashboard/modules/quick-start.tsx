import React, { useState } from 'react'
import { Space, Checkbox, Button, Select } from 'antd'
import { isArray, isNumber, isString } from 'asura-eye'
import { useLoading, useMsg } from '@/util'
import { Icon } from '@/components'
import { useSysStore } from '@/store/sys'
import { useTaskStore } from '@/store/task'

export const QuickStart = () => {
  const sys = useSysStore()
  const task = useTaskStore()
  const { loadings } = task
  const { context, success } = useMsg()

  const [loading, setLoading] = useLoading()
  const [edit, setEdit] = useState<boolean>(false)
  const [select, setSelect] = useState<string[]>([])

  const startApp = (path: string) => {
    if (!isString(path)) return
    window.api.invoke('cmd', `start "" "${path}"`)
  }
  const handleSelf = {
    startApp,
    async updateApps() {
      task.add({
        id: 'quickStart__update-app',
        name: 'Quick Start Update Apps',
        async exec() {
          const apps: [string, string][] =
            (await window.api.invoke('updateApps', sys)) || []
          sys.set({ apps })
        },
      })
    },
    addGroup() {
      setLoading(1000)
      if (!sys.quickStarts) sys.quickStarts = [[]]
      else sys.quickStarts.push([])
      sys.selectedQuickStart = sys.quickStarts.length - 1
      sys.set({
        selectedQuickStart: sys.selectedQuickStart,
        quickStarts: sys.quickStarts,
      })
      sys.saveToFile('setting')
    },
    delGroup(i: number) {
      setLoading(1000)
      if (i < 0 || !isNumber(i)) return

      sys.quickStarts = sys.quickStarts!.filter((_, j) => j !== i)
      const selected: number = sys.selectedQuickStart!
      if (selected === i) sys.selectedQuickStart = 0
      sys.set({
        selectedQuickStart: sys.selectedQuickStart,
        quickStarts: sys.quickStarts,
      })
      sys.saveToFile('setting')
    },
    setAppToGroup() {
      setLoading(1000)
      if (!sys.quickStarts) sys.quickStarts = []
      if (!isNumber(sys?.selectedQuickStart)) return
      const index: number = sys.selectedQuickStart!
      sys.quickStarts[index] = select
      setSelect([])
      sys.set({
        selectedQuickStart: sys.selectedQuickStart,
        quickStarts: sys.quickStarts,
      })
      sys.saveToFile('setting')
      success('Update Quick Start Success...')
    },
    runGroupApps() {
      setLoading(true)
      const { quickStarts, selectedQuickStart } = sys
      if (
        !isNumber(selectedQuickStart) ||
        !isArray(quickStarts) ||
        quickStarts.length < 1
      )
        return setLoading(false)
      const list = quickStarts[selectedQuickStart]
      if (!isArray(list) || list.length < 1) return setLoading(false)
      task.add({
        id: 'quickStart__start-group',
        name: 'Quick Start / Run a group of apps',
        async exec() {
          await Promise.all(list.map(startApp))
          setLoading(false)
        },
      })
      return
    },
    addApp() {
      setLoading(1000)
      if (!isNumber(sys?.selectGitModule)) return
      if (!sys.quickStarts) sys.quickStarts = [select]
      else sys.quickStarts.push(select)
      sys.set({
        quickStarts: sys.quickStarts,
      })
      sys.saveToFile('setting')
    },
    select(i: number) {
      setSelect(sys.quickStarts?.[i] || [])
      sys.set({
        selectedQuickStart: i,
      })
      sys.saveToFile('setting')
    },
  }

  const total = sys?.quickStarts?.reduce(
    (sum, _) => sum + (isArray(_) ? _.length : 0),
    0,
  )
  const getRenderList = () => {
    if (!sys.apps?.length || !sys?.quickStarts?.length) return []
    return sys.quickStarts
  }
  const renderList = getRenderList()

  const getAppOptions = () => {
    const ignoreApps = sys.ignoreApps
    const ignoreNames = ignoreApps?.split(',').map((_) => _.trim())
    return sys.apps
      ?.filter(([, label]) => {
        if (ignoreNames?.length) {
          for (let i = 0; i < ignoreNames.length; i++)
            if (label.indexOf(ignoreNames[i]) > -1) return false
          return true
        }
        return true
      })
      ?.map(([value, label]) => ({
        value,
        label: label.replace('.lnk', ''),
      }))
  }
  const appOptions = getAppOptions()
  return (
    <div
      className="dash-quickStart"
      data-edit={edit}
      data-disabled={!sys.initSuccess}
    >
        <div
          className="flex space-between items-center"
          style={{ padding: '20px 20px 0' }}
        >
          <h4>Quick Start</h4>
          <div className="flex gap bold text-12 items-center">
            <span>
              {total || 0} / {sys.apps?.length}
            </span>
            <Button
              icon={<Icon type="edit" />}
              loading={loading}
              onClick={() => {
                setEdit(!edit)
                setSelect(sys.quickStarts?.[sys?.selectedQuickStart || 0] || [])
              }}
            />
            {sys.apps?.length && sys?.quickStarts && (
              <Button
                icon={<Icon type="run" />}
                loading={loading || loadings.quickStart}
                disabled={
                  !isNumber(sys?.selectedQuickStart) ||
                  !sys?.quickStarts[sys?.selectedQuickStart]
                }
                className="bold"
                onClick={() => handleSelf.runGroupApps()}
              >
                Start All
              </Button>
            )}
          </div>
        </div>
        <div className="dash-quickStart-container grid overflow-y gap">
          <div className="quickStart-app-container flex row gap">
            {renderList.map((quickStart, qi) => {
              if (!isArray<string>(quickStart))
                return <React.Fragment key={qi} />
              const list = quickStart?.filter((_) => isString(_)) || []
              return (
                <div className="quickStart-group" key={qi}>
                  <Checkbox
                    checked={qi === sys?.selectedQuickStart}
                    onChange={() => handleSelf.select(qi)}
                  >
                    <div className="quickStart-group-container">
                      {list.length === 0 && (
                        <div style={{ color: 'rgba(255,255,255, .5)' }}>
                          Place select apps
                        </div>
                      )}
                      {list.map((path, pi) => {
                        if (!isString(path) || !path)
                          return <React.Fragment key={pi} />

                        const fileName = sys.apps?.find(
                          (_) => _[0] === path,
                        )?.[1]
                        return (
                          <div
                            className="quickStart-app"
                            key={path}
                            onClick={() => {
                              window.api.invoke('cmd', `start "" "${path}"`)
                            }}
                          >
                            {fileName?.replace('.lnk', '')}
                          </div>
                        )
                      })}
                    </div>
                  </Checkbox>

                  <Icon
                    type="close"
                    title="delete"
                    className="quickStart-group-del"
                    onClick={() => handleSelf.delGroup(qi)}
                  />
                </div>
              )
            })}
          </div>
          {edit && (
            <div className="flex gap row">
              <Button icon={<Icon type="add" />} onClick={handleSelf.addGroup}>
                Add
              </Button>
              <Button
                icon={<Icon type="reload" />}
                onClick={handleSelf.updateApps}
              >
                Update Apps
              </Button>
            </div>
          )}
          {edit &&
            isNumber(sys.selectedQuickStart) &&
            isArray(sys.quickStarts) &&
            sys.quickStarts.length && (
              <Space.Compact>
                <Select
                  style={{ width: 'calc( 100% - 60px )' }}
                  mode="multiple"
                  value={select}
                  placeholder="Select Quick Start App"
                  allowClear
                  onChange={setSelect}
                  options={appOptions}
                />
                <Button
                  loading={loading}
                  icon={<Icon type="save" />}
                  style={{ width: 110 }}
                  onClick={handleSelf.setAppToGroup}
                >
                  Update
                </Button>
              </Space.Compact>
            )}
        </div>
      {context}
    </div>
  )
}
