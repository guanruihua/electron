import { PageState } from '../../helper'
import './file-info.less'
import { FileInfoBox } from './file-info-box'

type Props = {
  pageState: PageState
}

export const FileInfo = (props: Props) => {
  const { pageState } = props

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
    <div className="frm-card frm-card-info" data-hidden={!pageState?.select?.parentPath || pageState?.setting?.showInfo !== 1} data-file-type={pageState?.select?.fileType || 'default'}>
      <FileInfoBox items={items} pageState={pageState} />
      <FileInfoBox type="stats" items={fileItems} pageState={pageState} />
    </div>
  )
}
