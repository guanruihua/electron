import { Timeline, TimelineItemProps } from 'antd'
import { useTaskStore } from '@/store/task'
import { isNumber } from 'asura-eye'
import dayjs from 'dayjs'
import './timeline.less'

export function Dash_Timeline() {
  const task = useTaskStore()
  return (
    <div className="dash-timeline" data-hidden={!task.tasks.length}>
      <Timeline
        titleSpan={'100px'}
        items={task.tasks
          .map((item) => {
            const { startTime, endTime, status, name, errorMsg } = item
            const TL: TimelineItemProps = {}
            if (status === 'success') TL.color = 'var(--success)'
            if (status === 'warning') TL.color = 'var(--warning)'
            if (status === 'error') TL.color = 'var(--error)'
            if (status === 'idle') TL.color = 'rgb(156, 190, 241)'
            if (status === 'running') {
              TL.color = 'rgb(156, 190, 241)'
              TL.loading = true
            }
            TL.title = (
              <div style={{ color: TL.color }}>
                {isNumber(startTime)
                  ? dayjs(startTime).format('HH:mm:ss SSS')
                  : 'Pending'}
              </div>
            )
            TL.content = (
              <div className="dash-timeline-item-content">
                <div className="name" style={{ color: TL.color }}>
                  {name}
                </div>
                {errorMsg && <pre className="errorMsg">{errorMsg}</pre>}
                {isNumber(startTime) && (
                  <div className="endTime">
                    {dayjs(endTime).format('HH:mm:ss SSS')}
                  </div>
                )}
              </div>
            )

            return TL
          })
          .reverse()}
      />
    </div>
  )
}
