import React from 'react'
import { Icon } from '@/components'
import { Loadings, SetLoadings } from '@/util'
import { isArray } from 'asura-eye'

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
  loadings: Loadings
  setLoadings: SetLoadings
  setOpen(open: string[]): void
  style?: React.CSSProperties
  depth: number
  currentDepth?: number
}
export const FileTree = (props: Props) => {
  const { tree, currentDepth = 0, ...rest } = props
  const { loadings, setLoadings, open, setOpen, depth, ...rest2 } = rest

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
  const getFileType = (item: FileNode) => {
    if (item.type === 'directory') return 'dir'
    if (['.zip', '.7z', '.rar'].some(v=>item.name.endsWith(v))) return 'zip'
    if (['.exe'].some(v=>item.name.endsWith(v))) return 'exe'
    if (['.mp3'].some(v=>item.name.endsWith(v))) return 'music'
    if (['.ts'].some(v=>item.name.endsWith(v))) return 'ts'
    if (['.js', '.cjs', '.mjs'].some(v=>item.name.endsWith(v))) return 'js'
    if (['.json', '.jsonc'].some(v=>item.name.endsWith(v))) return 'json'
    if (['.lnk'].some(v=>item.name.endsWith(v))) return 'lnk'
    if (['.html'].some(v=>item.name.endsWith(v))) return 'html'
    if (['.css'].some(v=>item.name.endsWith(v))) return 'css'
    return 'file'
  }

  const IconMap = {
    dir: (
      <>
        <Icon className="right-arrow transition" type="right-arrow" />
        <Icon type="dir" />
      </>
    ),
    zip: <Icon type="zip" style={{ fontSize: 14 }} />,
    file: <Icon type="file2" style={{ fontSize: 17, marginLeft: -1 }} />,
    exe: <Icon type="exe" style={{ fontSize: 14 }} />,
    js: <Icon type="js" style={{ fontSize: 15 }} />,
    json: <Icon type="json" style={{ fontSize: 15 }} />,
    ts: <Icon type="ts" style={{ fontSize: 15 }} />,
    music: <Icon type="music-file" style={{ fontSize: 14 }} />,
    lnk: <Icon type="lnk" style={{ fontSize: 15 }} />,
    html: <Icon type="html" style={{ fontSize: 15 }} />,
    css: <Icon type="css" style={{ fontSize: 15 }} />,
  }

  return (
    <div className="frm-file-tree" {...rest2}>
      {renderTree.map((item: FileNode, i) => {
        const { path, type } = item
        const isDirectory = type == 'directory'
        const isFold = !open.includes(path)
        const fileType = getFileType(item)
        const hasChildren = isArray<FileNode>(item.children) && item.children.length >0
        return (
          <div
            key={i}
            className="frm-file-tree-item"
            data-fold={isFold}
            data-dir={isDirectory}
            data-has-child={hasChildren}
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
                  {IconMap[fileType]}
                </div>
                <div className="name text-12 flex items-center justify-center">
                  <span>{item.name}</span>
                  <span
                    className="ml"
                    style={{ color: 'rgba(255,255,255, .4)' }}
                  >
                    {item.children?.length || ''}
                  </span>
                  {/* {isDirectory && (
                    <Icon
                      loading={loadings.dir}
                      type="dir"
                      className="opt dir"
                      onClick={() =>
                        setLoadings(
                          window.api.invoke('cmd', `explorer "${item.path}"`),
                          'dir',
                        )
                      }
                    />
                  )} */}
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
