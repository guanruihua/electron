import dayjs from 'dayjs'
import { IconMap, PageState } from '../../helper'

type Props = {
  type?: 'stats'
  pageState?: PageState
  items: string[][]
}

export const FileInfoBox = (props: Props) => {
  const { type, items = [], pageState = {} } = props
  const { select, selectDrive = 'C:\\' } = pageState

  const getValue = (key: string, dataType: string) => {
    if (type === 'stats') {
      const value = select?.stats?.[key] ?? ''
      if (dataType === 'time' && value) {
        const time = dayjs(value)
        if (dayjs.isDayjs(time)) return time.format('YYYY-MM-DD HH:mm:ss')
        return '-'
      }
      return value ?? '-'
    }
    return select?.[key] ?? '-'
  }

  return (
    <div className="frm-card-info-box">
      {items.map(([key, name, dataType = 'default']) => (
        <div key={key} className="frm-card-info-row" data-key={key}>
          <div className="frm-card-info-name">{name || key}</div>
          <div
            className="frm-card-info-value"
            data-type={dataType}
            onClick={() => {
              if (dataType !== 'path') return
              const path = select?.[key] || selectDrive || 'C:\\'
              if (!path) return
              window.api.invoke('cmd', `explorer "${path}"`)
            }}
          >
            {key === 'name' && select?.fileType && IconMap[select.fileType]}
            <span>{getValue(key, dataType)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
