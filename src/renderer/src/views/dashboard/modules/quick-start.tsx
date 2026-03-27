import React, { useState } from 'react'
import { Space, Checkbox, Button, Select } from 'antd'
import { isArray, isNumber, isString } from 'asura-eye'
import { ModuleProps } from '@/type'
import { useLoading } from '@/util'
import { Icon } from '@/components'

export const QuickStart = (props: ModuleProps) => {
  const { handle, state } = props.h
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
      const apps: [string, string][] =
        (await window.api.invoke('updateApps', state.sysSetting)) || []

      state.apps = apps
      handle.renderState()
    },
    addGroup() {
      setLoading(1000)
      if (!handle.setDefaultState(state)) return
      if (!state.setting.quickStarts) state.setting.quickStarts = [[]]
      else state.setting.quickStarts.push([])
      state.setting.selectedQuickStart = state.setting.quickStarts.length - 1
      handle.renderState()
      handle.saveToFile('setting')
    },
    delGroup(i: number) {
      setLoading(1000)
      if (i < 0 || !isNumber(i) || !handle.setDefaultState(state)) return

      state.setting.quickStarts = state.setting.quickStarts!.filter(
        (_, j) => j !== i,
      )
      const selected: number = state.setting.selectedQuickStart!
      if (selected === i) state.setting.selectedQuickStart = 0
      handle.renderState()
      handle.saveToFile('setting')
    },
    setAppToGroup() {
      setLoading(1000)
      if (handle.setDefaultState(state)) {
        if (!state.setting.quickStarts) state.setting.quickStarts = []
        if (!isNumber(state.setting?.selectedQuickStart)) return
        const index: number = state.setting.selectedQuickStart!
        state.setting.quickStarts[index] = select
        handle.renderState()
        setSelect([])
        handle.saveToFile('setting')
        handle.success('Update Quick Start Success...')
      }
    },
    startGroup() {
      if (!state?.setting) return
      const { quickStarts, selectedQuickStart } = state.setting
      if (
        !isNumber(selectedQuickStart) ||
        !isArray(quickStarts) ||
        quickStarts.length < 1
      )
        return
      const list = quickStarts[selectedQuickStart]
      if (!isArray(list) || list.length < 1) return
      setLoading(Promise.all(list.map(startApp)))
    },
    addApp() {
      setLoading(1000)
      if (
        !handle.setDefaultState(state) ||
        !isNumber(state.setting?.selectGitModule)
      )
        return
      if (!state.setting.quickStarts) state.setting.quickStarts = [select]
      else state.setting.quickStarts.push(select)
      handle.renderState()
      handle.saveToFile('setting')
    },
    select(i: number) {
      if (!handle.setDefaultState(state)) return
      state.setting.selectedQuickStart = i
      setSelect(state.setting.quickStarts?.[i] || [])
      handle.renderState()
      handle.saveToFile('setting')
    },
  }

  const total = state.setting?.quickStarts?.reduce(
    (sum, _) => sum + (isArray(_) ? _.length : 0),
    0,
  )
  const getRenderList = () => {
    if (!state.apps?.length || !state.setting?.quickStarts?.length) return []
    return state.setting.quickStarts
  }
  const renderList = getRenderList()

  const getAppOptions = () => {
    const ignoreApps = state.setting?.ignoreApps
    const ignoreNames = ignoreApps?.split(',').map((_) => _.trim())
    return state.apps
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
      className="root-layout-home-view-quick-start"
      data-edit={edit}
      data-disabled={!state?.sysSetting?.path}
    >
      <div className="module-bg" style={{ padding: 0 }}>
        <div
          className="flex space-between items-center"
          style={{ padding: '20px 20px 0' }}
        >
          <h4>Quick Start</h4>
          <div className="flex gap bold text-12 items-center">
            <span>
              {total || 0} / {state.apps?.length}
            </span>
            <Button
              icon={<Icon type="edit" />}
              loading={loading}
              onClick={() => {
                setEdit(!edit)
              }}
            />
            {state.apps?.length && state.setting?.quickStarts && (
              <Button
                icon={<Icon type="run" />}
                loading={loading}
                disabled={
                  !isNumber(state.setting?.selectedQuickStart) ||
                  !state?.setting?.quickStarts[
                    state?.setting?.selectedQuickStart
                  ]
                }
                className="bold"
                onClick={() => handleSelf.startGroup()}
              >
                Start All
              </Button>
            )}
          </div>
        </div>
        <div className="root-layout-home-view-quick-start-container grid overflow-y gap">
          <div className="quickStart-app-container flex row gap">
            {renderList.map((quickStart, qi) => {
              if (!isArray<string>(quickStart))
                return <React.Fragment key={qi} />
              const list = quickStart?.filter((_) => isString(_)) || []
              return (
                <div className="quickStart-group" key={qi}>
                  <Checkbox
                    checked={qi === state?.setting?.selectedQuickStart}
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

                        const fileName = state.apps?.find(
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
            isNumber(state?.setting?.selectedQuickStart) &&
            isArray(state?.setting?.quickStarts) &&
            state.setting.quickStarts.length && (
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
                  style={{ width: 100 }}
                  onClick={handleSelf.setAppToGroup}
                >
                  Update
                </Button>
              </Space.Compact>
            )}
        </div>
      </div>
    </div>
  )
}
