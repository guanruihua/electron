import { useTaskStore } from '@/store/task'
import { isNumber, isString } from 'asura-eye'
import dayjs from 'dayjs'
import './timeline.less'
import { Icon } from '@/components'
import { Popconfirm } from 'antd'

export function Dash_Timeline() {
  const task = useTaskStore()
  const getItems = () => {
    const items: any[] = []
    task.tasks?.forEach((item) => {
      const { id, endTime, status, execMsg } = item
      const last = items.at(-1)
      if (
        endTime &&
        last &&
        id === last.id &&
        status === last.status &&
        item.desc === last.desc &&
        !execMsg
      ) {
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
            execMsg,
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
                  ? dayjs(startTime).format('HH:mm:ss.SSS')
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
              <div className="name" style={{ color }}>
                {name}
              </div>

              {i + 1 !== items.length && (
                <div className="line-box">
                  <div className="line"></div>
                </div>
              )}
              <div className="message">
                {item.desc && <div className="desc">{item.desc}</div>}
                {isString(execMsg) &&
                  (execMsg.length > 120 ? (
                    <Popconfirm
                      title="Exec Message"
                      showCancel={false}
                      okButtonProps={{ style: { display: 'none' } }}
                      description={
                        <div
                          style={{
                            maxHeight: '40vh',
                            overflowY: 'auto',
                            maxWidth: '50vw',
                          }}
                        >
                          <pre style={{ whiteSpace: 'wrap' }}>{execMsg}</pre>
                        </div>
                      }
                    >
                      <pre className="execMsg" style={{ cursor: 'pointer' }}>
                        Exec Message: {execMsg.slice(0, 120) + '...'}
                      </pre>
                    </Popconfirm>
                  ) : (
                    <pre className="execMsg">Exec Message: {execMsg}</pre>
                  ))}
                {errorMsg && <pre className="errorMsg">{errorMsg}</pre>}

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
                {isNumber(endTime) && (
                  <div className="endTime">
                    {dayjs(endTime).format('HH:mm:ss.SSS')} /{' '}
                    {(endTime - startTime) / 1000}s
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
