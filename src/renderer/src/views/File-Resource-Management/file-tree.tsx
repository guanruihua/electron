import React from 'react'
import { Icon } from '@/components'

interface FileNode {
  // 文件夹/文件名
  name: string
  // 完整路径
  path: string
  // 是否为文件夹
  type: 'directory' | 'file' | string
  // isDirectory: boolean
  // 子节点（文件夹才有）
  // statusCode: string
  // statusDesc: string
  children?: FileNode[]
}

interface Props {
  tree: FileNode[]
  open: string[]
  setOpen(open: string[]): void
  style?: React.CSSProperties
  depth: number
  currentDepth?: number
}
export const FileTree = (props: Props) => {
  const { tree, currentDepth = 0, ...rest } = props
  const { open, setOpen, depth } = rest

  const getTree = () => {
    const list: any[] = tree
      .filter((_: any) => Boolean(_?.name))
      .map((item: any) => {
        item.sortBy = item.name.charCodeAt(0)
        if (item.type === 'directory') item.sortBy += 10000
        return item
      })
      .sort((a: any, b: any) => b.sortBy - a.sortBy)

    return list
  }
  const renderTree = getTree()

  return (
    <div className="frm-file-tree" {...rest}>
      {renderTree.map((item: FileNode, i) => {
        const { path, type } = item
        const isDirectory = type == 'directory'
        const isFold = !open.includes(path)
        return (
          <div
            key={i}
            className="frm-file-tree-item"
            data-fold={isFold}
            data-dir={isDirectory}
          >
            <div
              className="flex space-between px items-center"
              style={{ height: 24 }}
            >
              <div
                className="flex row pointer"
                onClick={() => {
                  if (!isDirectory) return
                  const newOpen = open.includes(path)
                    ? open.filter((_) => _ !== path)
                    : [path, ...open]

                  setOpen(newOpen)
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ paddingRight: 5, gap: 5 }}
                >
                  {isDirectory ? (
                    <>
                      <Icon
                        className="right-arrow transition"
                        type="right-arrow"
                      />
                      <Icon type="dir" />
                    </>
                  ) : (
                    <Icon type="file" />
                  )}
                </div>
                <div className="name text-12 flex items-center justify-center">
                  <span>{item.name}</span>
                  <span className='ml' style={{color: 'rgba(255,255,255, .4)'}}>{item.children?.length || ''}</span>
                </div>
              </div>
            </div>
            {isDirectory && !isFold && item.children && (
              <div className="children" style={{ paddingLeft: 15 }}>
                <FileTree
                  tree={item.children}
                  {...rest}
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
