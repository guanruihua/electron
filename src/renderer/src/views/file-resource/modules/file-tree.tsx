import React from 'react'
import { FileNode, IconMap } from '../helper'
import { Icon } from '@/components'
import FRM_Dropdown from '../components/Dropdown'
import { FRMStore } from '../store'
import './file-tree.less'

type Props = {
  style?: React.CSSProperties
  path: string
  currentDepth?: number

  frm: FRMStore
}

export const FileTree = (props: Props) => {
  const { frm, path, currentDepth = 0 } = props
  const { open = [] } = frm || {}

  const renderTree: FileNode[] =
    // frm?.pathMap?.[path]?.filter((_) => _.type === 'dir') || []
    frm?.pathMap?.[path] || []

  return (
    <div className="frm-file-tree">
      {renderTree?.map?.((item: FileNode, i) => {
        const { path, type, fileType = '' } = item
        if (!path) return <React.Fragment key={i} />

        const isDirectory = type == 'dir'
        const isFold = !open.includes(path)
        const child: FileNode[] = frm?.pathMap?.[path]

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
              <FRM_Dropdown file={item} frm={frm}>
                <div
                  className="frm-file-tree-item-render"
                  title={item.name}
                  onClick={() => frm.selectFileNode(item)}
                >
                  <div className="tree-logo">
                    {fileType === 'dir' ? (
                      <>
                        <Icon
                          className="right-arrow transition"
                          type="right-arrow"
                        />
                        <Icon type="dir" />
                      </>
                    ) : (
                      IconMap[fileType] || IconMap.file
                    )}
                  </div>
                  <div className="frm-file-tree-item-render-name">
                    {item.name}
                  </div>
                  <div
                    data-hidden={!isDirectory}
                    className="ml text-12"
                    style={{ color: 'rgba(255,255,255, .4)' }}
                  >
                    {child?.length || ''}
                  </div>
                </div>
              </FRM_Dropdown>
            </div>
            {isDirectory && !isFold && !!child?.length && (
              <div
                className="frm-children children"
                style={{ paddingLeft: 15 }}
              >
                <FileTree
                  frm={frm}
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
