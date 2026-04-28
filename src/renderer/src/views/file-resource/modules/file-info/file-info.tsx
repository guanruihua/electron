import './file-info.less'
import { FileInfoBox } from './file-info-box'
import { useFRMStore } from '../../store'

export const FileInfo = () => {
  const frm = useFRMStore()

  const items = [
    ['name', 'Name'],
    ['type', 'Type'],
    ['path', 'Path', 'path'],
    ['parentPath', 'Parent Path', 'path'],
  ]

  const fileItems = [
    ['size', '文件大小'],
    ['birthtimeMs', '创建时间', 'time'],
    ['mtimeMs', '修改时间', 'time'],
    ['atimeMs', '访问时间', 'time'],
    ['ctimeMs', '状态变更时间', 'time'],
  ]

  return (
    <div
      className="frm-card frm-card-info"
      data-hidden={
        !frm?.select?.parentPath || frm?.setting?.showInfo !== 1
      }
      data-file-type={frm?.select?.fileType || 'default'}
    >
      <FileInfoBox items={items} pageState={frm} />
      <FileInfoBox type="stats" items={fileItems} pageState={frm} />
    </div>
  )
}
