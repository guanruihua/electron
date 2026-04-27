import React from 'react'
import { Button } from 'antd'
import { isArray } from 'asura-eye'
import { Icon } from '@/components'
import { ModuleProps } from '@/type'
import { useSysStore } from '@/store/sys'

export function NodeTread(props: ModuleProps) {
  const sys = useSysStore()

  const { handle, loadings = {} } = props.h
  const { setLoadings } = handle

  return (
    <div className="root-layout-home-view-node-tread overflow-y flex col gap module-bg w">
      <div className="flex space-between items-center w">
        <h4>Node Thread</h4>
        <div className="flex gap">
          <Button
            loading={loadings.findAll}
            className="bolder"
            icon={<Icon type="run" />}
            onClick={() => setLoadings(sys.findNodeTreads(), 'findAll')}
          >
            Query
          </Button>
          <Button
            icon={<Icon type="stop" />}
            loading={loadings.stopAll}
            className="bolder"
            onClick={() => setLoadings(sys.stopNodeTreads(), 'stopAll')}
          >
            Stop
          </Button>
        </div>
      </div>
      {isArray(sys?.NodeTreads) && sys.NodeTreads.length > 0 && (
        <div
          className="grid all-node-tread border-radius"
          style={{
            gridTemplateColumns: '1fr 100px 100px auto',
            paddingTop: 10,
          }}
        >
          {['项目', 'PID', '内存', ''].map((item, i) => (
            <div key={i} className="flex items-center bold text-12">
              {item}
            </div>
          ))}
          <div
            className="grid-span-full"
            style={{
              paddingTop: 10,
              borderBottom: '2px solid rgba(255, 255, 255, .3)',
            }}
          />
          {sys.NodeTreads.map((row: any, i) => {
            const key = `nt_${i}`
            return (
              <React.Fragment key={i}>
                <div
                  className="node-tread-row-title flex items-center text-12"
                  data-pid={row.pid}
                >
                  {row.title || 'Node'}
                </div>
                <div className="flex items-center text-12">{row.pid}</div>
                <div className="flex items-center text-12">
                  {row.memory}
                  {row.unit || 'K'}
                </div>
                <Icon
                  loading={loadings[key]}
                  type="stop"
                  className="opt stop"
                  style={{ fontSize: 24 }}
                  onClick={async () => {
                    if (!row.pid) return
                    setLoadings(true, key)
                    await window.api.invoke(
                      'cmd',
                      `taskkill /PID ${row.pid} /F`,
                    )
                    await sys.findNodeTreads()
                    setLoadings(false, key)
                  }}
                />
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}
