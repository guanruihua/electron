import React from 'react'
import { Button } from 'antd'
import { isArray } from 'asura-eye'
import { Icon } from './icon'

export function Opt({ handle, state }) {
  return (
    <div className="root-layout-home-view-opt">
      <h4 className="mb">Tool</h4>
      <div className="flex gap">
        <Button className="bolder" onClick={() => window.api.openMaskWindow()}>
          打开遮罩
        </Button>
        <Button className="bolder" onClick={handle.openDevtool}>
          Devtool
        </Button>
        <Button className="bolder" onClick={handle.reload}>
          Reload
        </Button>
      </div>

      <h4 className="my">Node Thread</h4>
      <div className="flex gap">
        <Button className="bolder" onClick={handle?.NodeThread?.findAll}>
          Find All
        </Button>
        <Button className="bolder" onClick={handle?.NodeTread?.stopAll}>
          Stop All
        </Button>
      </div>

      {isArray(state?.NodeTreads) && state.NodeTreads.length > 0 && (
        <div
          className="grid gap mt all-node-tread p border-radius"
          style={{ gridTemplateColumns: 'auto auto auto auto auto auto' }}
        >
          {['进程名', 'PID', '会话名', '会话号', '内存', ''].map((item, i) => (
            <div key={i} className="flex items-center bold">
              {item}
            </div>
          ))}
          {state.NodeTreads.map((row: any, i) => {
            return (
              <React.Fragment key={i}>
                <div className="flex items-center">{row.name}</div>
                <div className="flex items-center">{row.pid}</div>
                <div className="flex items-center">{row.session}</div>
                <div className="flex items-center">{row.sessionNum}</div>
                <div className="flex items-center">
                  {row.memory}
                  {row.unit || 'K'}
                </div>
                <Button
                  className="flex gap"
                  onClick={() => handle.NodeThread.stop(row)}
                >
                  <Icon type="stop" />
                  <span>Stop</span>
                </Button>
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}
