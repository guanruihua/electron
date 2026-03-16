import { ModuleProps } from '@/layout/type'
import { Space } from 'antd'
import { Checkbox } from 'antd'
import { Button, Select } from 'antd'
import { isArray, isNumber, isString } from 'asura-eye'
import React, { useState } from 'react'

export const QuickStart = (props: ModuleProps) => {
  const { handle, state } = props.h
  const [select, setSelect] = useState<string[]>([])
  const startApp = (path: string) => {
    if (!isString(path)) return
    window.api.invoke('cmd', `start "" "${path}"`)
  }
  const handleSelf = {
    startApp,
    addGroup() {
      if (!handle.setDefaultState(state)) return
      if (!state.setting.quickStarts) state.setting.quickStarts = [[]]
      else state.setting.quickStarts.push([])
      state.setting.selectedQuickStart = state.setting.quickStarts.length - 1
      handle.renderState()
      handle.saveToFile('setting')
    },
    delGroup(i: number) {
      if (i < 0 || !isNumber(i) || !handle.setDefaultState(state)) return

      if (!state.setting.quickStarts) state.setting.quickStarts = []
      else {
        state.setting.quickStarts = state.setting.quickStarts.filter(
          (_, i) => state.setting.selectedQuickStart !== i,
        )
        state.setting.selectedQuickStart =
          state.setting.quickStarts.length > 0 ? 0 : 'NaN'
      }
      handle.renderState()
      handle.saveToFile('setting')
    },
    setAppToGroup() {
      if (handle.setDefaultState(state)) {
        if (!state.setting.quickStarts) state.setting.quickStarts = []
        if (!isNumber(state.setting?.selectedQuickStart)) return
        const index: number = state.setting.selectedQuickStart!
        state.setting.quickStarts[index] = select
        handle.renderState()
        setSelect([])
        handle.saveToFile('setting')
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
      list.forEach(startApp)
    },
    addApp() {
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

  // React.useEffect(()=>{
  //   if(select.length !== state.setting?.quickStarts?.length){

  //   }
  // }, [state.setting?.selectedQuickStart])
  const total = state.setting?.quickStarts?.reduce(
    (sum, _) => sum + (isArray(_) ? _.length : 0),
    0,
  )
  return (
    <div className="root-layout-home-view-quick-start">
      <div className="module-bg" style={{ padding: 0 }}>
        <div
          className="flex space-between items-center mb"
          style={{ padding: '20px 20px 0' }}
        >
          <h4>Quick Start</h4>
          <div className="flex gap bold text-12 items-center">
            <span>
              {total} / {state.apps?.length}
            </span>
            <Button onClick={handleSelf.addGroup}>Add</Button>
            {state.apps?.length && state.setting?.quickStarts && (
              <Button
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
            {state.apps?.length &&
              state.setting?.quickStarts?.length &&
              state.setting.quickStarts.map((quickStart, qi) => {
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
                  </div>
                )
              })}
          </div>
          <Space.Compact>
            <Select
              style={{ width: 'calc( 100% - 60px )' }}
              mode="multiple"
              value={select}
              placeholder="Select Quick Start App"
              allowClear
              onChange={setSelect}
              options={state.apps?.map(([value, label]) => ({
                value,
                label: label.replace('.lnk', ''),
              }))}
            />
            <Button style={{ width: 100 }} onClick={handleSelf.setAppToGroup}>
              Update
            </Button>
          </Space.Compact>
        </div>
      </div>
    </div>
  )
}
