import React from 'react'
import { Button } from 'antd'
import { isArray } from 'asura-eye'
import { Icon } from '../icon'
import { ModuleProps } from '../../type'

export function NodeTread(props: ModuleProps) {
  const { handle, state } = props.h
  return (
    <div
      className="root-layout-home-view-node-tread overflow-y flex col gap module-bg w"
    >
      <div className="flex space-between items-center w">
        <h4 className="">Node Thread</h4>
        <div className="flex gap">
          <Button className="bolder" onClick={()=>handle?.NodeThread?.findAll(true)}>
            Find All
          </Button>
          <Button className="bolder" onClick={handle?.NodeTread?.stopAll(true)}>
            Stop All
          </Button>
        </div>
      </div>
      {isArray(state?.NodeTreads) && state.NodeTreads.length > 0 && (
        <div
          className="grid gap all-node-tread border-radius"
          style={{ gridTemplateColumns: 'auto 100px 100px 100px', paddingTop: 20 }}
        >
          {['项目', 'PID', '内存', ''].map((item, i) => (
            <div key={i} className="flex items-center bold">
              {item}
            </div>
          ))}
          {state.NodeTreads.map((row: any, i) => {
            return (
              <React.Fragment key={i}>
                <div
                  className="node-tread-row-title flex items-center"
                  data-pid={row.pid}
                >
                  {row.title || 'Node'}
                </div>
                <div className="flex items-center">{row.pid}</div>
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
