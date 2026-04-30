import { useTaskStore } from '@/store/task'
import { isNumber } from 'asura-eye'
import dayjs from 'dayjs'
import './timeline.less'
import { Icon } from '@/components'

export function Dash_Timeline() {
  const task = useTaskStore()
  const getItems = () => {
    const items: any[] = []
    task.tasks?.forEach((taskItem, i) => {
      const taskStatus = task.taskStatus[i]
      const item = taskStatus ? taskStatus : taskItem
      const { id, endTime, status } = item
      const last = items.at(-1)
      if (endTime && last && id === last.id && status === last.status) {
        items[items.length - 1] = {
          ...last,
          count: isNumber(last?.count) ? last.count + 1 : 2,
          endTime,
        }
        return
      }
      items.push(item)
    })
    return items.reverse()
  }
  const items = getItems()

  return (
    <div className="dash-timeline" data-hidden={!task.tasks.length}>
      <div className="timeline">
        {items.map((item, i) => {
          const {
            status = 'idle',
            startTime,
            name,
            errorMsg,
            endTime,
            count,
          } = item
          let color = 'rgb(156, 190, 241)'
          let loading = false
          if (status === 'success') color = 'var(--success)'
          if (status === 'warning') color = 'var(--warning)'
          if (status === 'error') color = 'var(--error)'
          if (status === 'idle') color = 'rgb(156, 190, 241)'
          if (status === 'running') {
            color = 'rgb(156, 190, 241)'
            loading = true
          }
          return (
            <div className="timeline-item" key={i}>
              <div className="title" style={{ color }}>
                {isNumber(startTime)
                  ? dayjs(startTime).format('HH:mm:ss SSS')
                  : 'Pending'}
              </div>
              <div className="dot-box">
                {/* {i % 3 === 0 && <Icon type="loading" />}
                {i % 3 === 1 && (
                  <div className="dot" style={{ background: color }}></div>
                )}
                {i % 3 === 2 && (
                  <div className="dot" style={{ background: color }}></div>
                )} */}
                {loading && <Icon type="loading" />}
                {!loading && (
                  <div className="dot" style={{ background: color }} />
                )}
              </div>
              <div className="content" style={{ color }}>
                {name}
              </div>
              {i + 1 !== items.length && (
                <div className="line-box">
                  <div className="line"></div>
                </div>
              )}
              <div className="message">
                {errorMsg && <pre className="errorMsg">{errorMsg}</pre>}
                {isNumber(endTime) && (
                  <div className="endTime">
                    End Time: {dayjs(endTime).format('HH:mm:ss SSS')}
                  </div>
                )}
                {count && (
                  <div className="executionCount">
                    Execution Count:{' '}
                    <span
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        marginLeft: 3,
                      }}
                    >
                      {count}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
