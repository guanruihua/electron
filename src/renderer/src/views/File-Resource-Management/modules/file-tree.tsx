import React from 'react'
import { Loadings } from '@/util'
import { FileNode, PageState, HandlePage } from '../helper'
import './file-tree.less'
import { Icon } from '@/components'

type Props = {
  pageState: PageState
  loadings: Loadings
  style?: React.CSSProperties
  path: string
  currentDepth?: number
  handlePage: HandlePage
}

export const FileTree = (props: Props) => {
  const { path, currentDepth = 0, ...rest } = props
  const { pageState, handlePage, loadings, ...rest2 } = rest
  const { open = [] } = pageState || {}
  const renderTree: FileNode[] =
    pageState?.pathMap?.[path]?.filter((_) => _.type === 'dir') || []

  return (
    <div className="frm-file-tree" {...rest2}>
      {renderTree?.map?.((item: FileNode, i) => {
        const { path, type } = item
        if (!path) return <React.Fragment key={i} />

        const isDirectory = type == 'dir'
        const isFold = !open.includes(path)
        const child: FileNode[] = pageState?.pathMap?.[path]

        return (
          <div
            key={i}
            className="frm-file-tree-item"
            data-fold={isFold}
            data-dir={isDirectory}
          >
            <div
              className="frm-label flex space-between px items-center"
              style={{
                zIndex: 1000 - currentDepth,
              }}
            >
              <div
                className="frm-file-tree-item-render"
                title={item.name}
                onClick={() => handlePage.selectFileNode(item)}
              >
                <Icon className="right-arrow transition" type="right-arrow" />
                <Icon type="dir" />
                <span className="frm-file-tree-item-render-name">
                  {item.name}
                </span>
                <span
                  data-hidden={!isDirectory}
                  className="ml text-12"
                  style={{ color: 'rgba(255,255,255, .4)' }}
                >
                  {child?.length || ''}
                </span>
              </div>
            </div>
            {isDirectory && !isFold && !!child?.length && (
              <div
                className="frm-children children"
                style={{ paddingLeft: 15 }}
              >
                <FileTree
                  {...rest}
                  path={path}
                  currentDepth={currentDepth + 1}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
