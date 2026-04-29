import React from 'react'
import { Button } from 'antd'
import { isArray } from 'asura-eye'
import { Icon } from '@/components'
import { useSysStore } from '@/store/sys'
import { useTaskStore } from '@/store/task'

export function NodeTread() {
  const sys = useSysStore()
  const task = useTaskStore()
  const loadings = task.loadings

  return (
    <div className="root-layout-home-view-node-tread overflow-y flex col gap module-bg w">
      <div className="flex space-between items-center w">
        <h4>Node Thread</h4>
        <div className="flex gap">
          <Button
            loading={loadings.nodeThread}
            icon={<Icon type="run" />}
            onClick={() =>
              task.add({
                id: 'nodeThread__query',
                name: 'Query Node Thread',
                exec: sys.findNodeTreads,
              })
            }
          >
            Query
          </Button>
          <Button
            icon={<Icon type="stop" />}
            loading={loadings.nodeThread}
            onClick={() =>
              task.add({
                id: 'nodeThread__stopAll',
                name: 'Stop All Node Thread',
                exec: sys.stopNodeTreads,
              })
            }
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
          {sys.NodeTreads.map((row: any, i) => (
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
                loading={loadings.nodeThread || loadings[`nodeThread__stop-${row.pid}`]}
                type="stop"
                className="opt stop"
                style={{ fontSize: 24 }}
                onClick={async () => {
                  if (!row.pid) return
                  task.add({
                    id: `nodeThread__stop-${row.pid}`,
                    name: `Stop Node Thread PID(${row.pid})`,
                    async exec() {
                      await window.api.invoke(
                        'cmd',
                        `taskkill /PID ${row.pid} /F`,
                      )
                    },
                  })
                  task.add({
                    id: 'nodeThread__query',
                    name: 'Query Node Thread',
                    exec: sys.findNodeTreads,
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
