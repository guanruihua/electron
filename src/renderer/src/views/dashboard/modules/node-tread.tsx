import React from 'react'
import { Button } from 'antd'
import { isArray } from 'asura-eye'
import { Icon } from '@/components'
import { ModuleProps } from '@/type'

export function NodeTread(props: ModuleProps) {
  const { handle, state, loadings={} } = props.h
  const { setLoadings, NodeThread } = handle
  return (
    <div className="root-layout-home-view-node-tread overflow-y flex col gap module-bg w">
      <div className="flex space-between items-center w">
        <h4 className="">Node Thread</h4>
        <div className="flex gap">
          <Button
            loading={loadings.findAll}
            className="bolder"
            onClick={() => setLoadings(NodeThread?.findAll(true), 'findAll')}
          >
            Find All
          </Button>
          <Button
            loading={loadings.stopAll}
            className="bolder"
            onClick={() => setLoadings(NodeThread?.stopAll(true), 'stopAll')}
          >
            Stop All
          </Button>
        </div>
      </div>
      {isArray(state?.NodeTreads) && state.NodeTreads.length > 0 && (
        <div
          className="grid gap all-node-tread border-radius"
          style={{
            gridTemplateColumns: '1fr 100px 100px auto',
            paddingTop: 20,
          }}
        >
          {['项目', 'PID', '内存', ''].map((item, i) => (
            <div key={i} className="flex items-center bold">
              {item}
            </div>
          ))}
          <div className="grid-span-full border-b" />
          {state.NodeTreads.map((row: any, i) => {
            const key = `nt_${i}`
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
                <Icon
                  loading={loadings[key]}
                  type="stop"
                  className="opt stop"
                  style={{ fontSize: 24 }}
                  onClick={() => setLoadings(handle.NodeThread.stop(row), key)}
                />
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}
