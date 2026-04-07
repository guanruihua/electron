import { Button } from 'antd'
import { PageState, FileNode } from '../../helper'
import './review.less'

type Props = {
  pageState: PageState
}

export const FileReview = (props: Props) => {
  const { pageState } = props
  const { select } = pageState || {}
  const renderTree: FileNode[] = pageState?.pathMap?.[select?.path || ''] || []

  return (
    <div
      className="frm-card-review frm-card"
      data-hidden={!pageState?.select?.path}
    >
      {renderTree.map((item: FileNode) => {
        const { path, name } = item
        return <div key={item.path} className='frm-card-review-row'>{name}</div>
      })}
      {/* {JSON.stringify(renderTree)} */}
    </div>
  )
}
