import React from 'react'
import { Button } from 'antd'
import { isArray } from 'asura-eye'
import { Icon } from '@/components'
import { useTaskStore } from '@/store/task'
import { useProjStore } from '@/views/project/store'

export function NodeTread() {
  const p = useProjStore()
  const task = useTaskStore()
  const loadings = task.loadings
  return (
    <div className="root-layout-home-view-node-tread overflow-y flex col gap layout-module w">
      <div className="flex space-between items-center w">
        <h4>Node Thread</h4>
        <div className="flex gap">
          <Button
            loading={loadings.nodeThread}
            icon={<Icon type="search" />}
            onClick={() =>
              task.run({
                uid: 'nodeThread/query',
                exec: p.findNodeTreads,
              })
            }
          />
          <Button
            icon={<Icon type="stop" />}
            loading={loadings.nodeThread}
            onClick={() =>
              task.run({
                uid: 'nodeThread/stopAll',
                exec: p.stopNodeTreads,
              })
            }
          />
        </div>
      </div>
      {isArray(p?.NodeTreads) && p.NodeTreads.length > 0 && (
        <div
          className="grid all-node-tread border-radius"
          style={{
            gridTemplateColumns: '1fr auto auto auto',
            paddingTop: 10,
            gap: '0 10px',
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
          {p.NodeTreads.map((row: any, i) => (
            <React.Fragment key={i}>
              <div
                className="node-tread-row-title flex items-center text-12"
                data-pid={row.pid}
              >
                {row.title || 'Node'}
              </div>
              <div className="flex items-center text-12">
                {isArray(row.pid) ? row.pid.join(', ') : row.pid}
              </div>
              <div className="flex items-center text-12">
                {`${(Number(row.memory) / 1048576).toFixed(2)} ${row.unit || 'M'}`}
              </div>
              <Icon
                loading={
                  loadings.nodeThread || loadings[`nodeThread/stop-${row.pid}`]
                }
                type="stop"
                className="opt stop"
                style={{ fontSize: 24 }}
                onClick={async () => {
                  if (!row.pid) return
                  await task.run({
                    uid: `nodeThread/stop-${row.pid}`,
                    async exec() {
                      return await window.api.invoke(
                        'cmd',
                        `taskkill /PID ${row.pid} /F`,
                      )
                    },
                  })
                  await task.run({
                    uid: 'nodeThread/query',
                    exec: p.findNodeTreads,
                  })
                }}
              />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
