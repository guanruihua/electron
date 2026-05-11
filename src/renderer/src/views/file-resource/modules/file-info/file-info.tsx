import './file-info.less'
import { useFRMStore } from '../../store'
import dayjs from 'dayjs'
import { isNumber, isString } from 'asura-eye'
import { IconMap } from '../../helper'

const formatTime = (value: any) => {
  if (!isNumber(value)) return '-'
  const time = dayjs(value)
  if (dayjs.isDayjs(time)) return time.format('YYYY-MM-DD HH:mm:ss')
  return '-'
}

export const FileInfo = () => {
  const frm = useFRMStore()
  const { select = {} }: any = frm || {}
  const { stats = {} }: any = select || {}
  console.log(select)

  const items = [
    [
      <>
        {select?.fileType && IconMap[select.fileType]}
        <span>{select?.name}</span>
      </>,
      'Name',
      'name',
    ],
    [select?.path, 'Path', 'path'],
    [
      select?.parentPath,
      'Parent Path',
      'path',
      () => {
        if (!isString(select?.parentPath)) return
        window.api.invoke('cmd', `explorer "${select.parentPath}"`)
      },
    ],
  ]
  const items2 = [
    [select?.type, 'Type', 'type'],
    [stats?.size, '文件大小', 'size'],
    [formatTime(stats?.birthtimeMs), '创建时间', 'time'],
    [formatTime(stats?.mtimeMs), '修改时间', 'time'],
    [formatTime(stats?.atimeMs), '访问时间', 'time'],
    [formatTime(stats?.ctimeMs), '状态变更时间', 'time'],
  ]

  const Render = (items) =>
    items.map(([value, name, dataType = 'default', click], i) => (
      <div key={i} className="frm-card-info-row" data-type={dataType}>
        <div className="frm-card-info-name">{name}</div>
        <div
          className="frm-card-info-value"
          data-can-click={!!click}
          onClick={click}
        >
          {value}
        </div>
      </div>
    ))

  return (
    <div
      className="frm-card frm-card-info"
      data-hidden={!frm?.select?.parentPath || frm?.setting?.showInfo !== 1}
      data-file-type={frm?.select?.fileType || 'default'}
    >
      {Render(items)}
      <div className="frm-card-info-layout-grid">{Render(items2)}</div>
    </div>
  )
}
