import { Image } from 'antd'
import { PageState, FileNode, HandlePage, IconMap } from '../../../helper'
import ReviewFile_JSON from './json/json'

type Props = {
  pageState: PageState
  handlePage: HandlePage
}

export default function ReviewFile(props: Props) {
  const { pageState, handlePage } = props
  const { select } = pageState || {}
  const { name, path, fileType } = (select || {}) as FileNode

  console.log(pageState?.select)

  const Render = () => {
    if (fileType === 'image') return <Image src={`file://${path}`} />
    if (fileType === 'json')
      return <ReviewFile_JSON file={select as FileNode} />

    return 'No Review ...'
  }

  return (
    <div
      className="frm-review-layout frm-review-layout__file"
      data-file-type={fileType}
    >
      <div className="frm-review-header">
        <div className="frm-review-item-box">
          {IconMap[select?.fileType || ''] || IconMap.file}
          <span>{select?.name}</span>
        </div>
      </div>
      <div className="frm-review-container">
        <Render />
      </div>
      <div className="frm-review-footer"></div>
    </div>
  )
}
