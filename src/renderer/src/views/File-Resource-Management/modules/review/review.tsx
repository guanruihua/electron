import { Pagination } from 'antd'
import {
  PageState,
  FileNode,
  getFileType,
  IconMap,
  HandlePage,
} from '../../helper'
import './review.less'
import { useState } from 'react'
import { useEffect } from 'react'
import { Image } from 'antd'

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

  const [count, setCount] = useState(3)
  useEffect(() => {
    const q = '.frm-review'
    const dom = document.querySelector(q)
    if (!dom) return
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect
        // console.log(`宽度变化：${width}px`)
        const newCount = Math.max(1, Math.floor(width / 300))
        if (newCount === count) return
        setCount(newCount)
      }
    })
    resizeObserver.observe(dom)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const cols = new Array(count)
    .fill('')
    .map((_, i) => renderTree.filter((_, j) => j % count === i))

  return (
    <div
      className="frm-review frm-card"
      data-hidden={
        !pageState?.select?.path
        // || pageState.select?.fileType !== 'file'
      }
    >
      <div className="frm-review-header"></div>
      <div className="frm-review-container" style={{
        gridTemplateColumns: `${new Array(count).fill('1fr').join(' ')}`
      }}>
        {cols.map((col, i) => (
          <div key={i} className="frm-review-container-col">
            {col.map((item: FileNode) => {
              const { name, path } = item
              const fileType = getFileType(item)
              if (fileType === 'image') {
                return (
                  <div
                    key={path}
                    className="frm-review-item"
                    // onClick={() => handlePage.selectFileNode(item)}
                  >
                    {/* <img src={`file://${path}`} /> */}
                    <Image src={`file://${path}`} />
                    <div className="frm-review-item-name">{name}</div>
                  </div>
                )
              }
              return (
                <div
                  key={path}
                  className="frm-review-item"
                  onClick={() => handlePage.selectFileNode(item)}
                >
                  {IconMap[fileType]}
                  {name}
                </div>
              )
            })}
          </div>
        ))}
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
