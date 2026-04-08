import { Button, Pagination } from 'antd'
import {
  PageState,
  FileNode,
  getFileType,
  IconMap,
  HandlePage,
} from '../../helper'
import './review.less'
import { useState } from 'react'

type Props = {
  pageState: PageState
  handlePage: HandlePage
}

export const FileReview = (props: Props) => {
  const { pageState, handlePage } = props
  const { select } = pageState || {}

  const [paging, setPaging] = useState({
    current: 1,
    pageSize: 50,
  })
  const tree: FileNode[] = pageState?.pathMap?.[select?.path || ''] || []
  const { current, pageSize } = paging
  const renderTree: FileNode[] = tree.slice(
    (current - 1) * pageSize,
    current * pageSize,
  )

  return (
    <div
      className="frm-review frm-card"
      data-hidden={
        !pageState?.select?.path
        // || pageState.select?.fileType !== 'file'
      }
    >
      <div className="frm-review-header"></div>
      <div className="frm-review-container">
        {renderTree.slice(0, 50).map((item: FileNode) => {
          const { name } = item
          const fileType = getFileType(item)

          return (
            <div
              key={item.path}
              className="frm-review-row"
              onClick={() => handlePage.selectFileNode(item)}
            >
              {IconMap[fileType]}
              {name}
            </div>
          )
        })}
      </div>
      <div className="frm-review-footer">
        <div className="frm-review-footer-total">Total: {tree.length}</div>
        <Pagination
          size="small"
          showSizeChanger
          pageSize={paging.pageSize}
          current={paging.current}
          total={tree?.length || 0}
          pageSizeOptions={[10, 20, 50, 100]}
          onChange={(current, pageSize) => {
            setPaging({ current, pageSize })
          }}
        />
      </div>
    </div>
  )
}
