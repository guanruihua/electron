import { ModuleProps } from '@/layout/type'
import { Space } from 'antd'
import { Button, Select } from 'antd'
import { useState } from 'react'

export const QuickStart = (props: ModuleProps) => {
  const { handle, state } = props.h
  const [select, setSelect] = useState([])

  return (
    <div className="root-layout-home-view-quick-start">
      <div className="module-bg" style={{ padding: 0 }}>
        <div
          className="flex space-between items-center mb"
          style={{ padding: '20px 20px 0' }}
        >
          <h4>Quick Start</h4>
          <div className="flex gap bold text-12">
            {state.setting?.quickStarts?.length} / {state.apps?.length}
          </div>
        </div>
        <div className="root-layout-home-view-quick-start-container grid overflow-y gap">
          <div className="quickStart-app-container flex row gap">
            {state.apps?.length &&
              state.setting?.quickStarts?.map((path) => {
                const fileName = state.apps?.find((_) => _[0] === path)?.[1]
                return (
                  <div className="quickStart-app" key={path} onClick={()=>{
                    window.api.invoke('cmd', `start "" "${path}"`)
                  }}>
                    {fileName?.replace('.lnk', '')}
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
              options={state.apps
                ?.map(([value, label]) => ({
                  value,
                  label: label.replace('.lnk', ''),
                }))}
            />
            <Button
              style={{ width: 60 }}
              onClick={() => {
                if (handle.setDefaultState(state)) {
                  if (!state.setting.quickStarts) state.setting.quickStarts = []

                  state.setting.quickStarts = [
                    ...new Set(state.setting.quickStarts.concat(select)),
                  ]
                  handle.renderState()
                  setSelect([])
                  handle.saveToFile('setting')
                }
              }}
            >
              Add
            </Button>
          </Space.Compact>
        </div>
      </div>
    </div>
  )
}
