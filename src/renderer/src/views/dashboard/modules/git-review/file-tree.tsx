import { FileTreeType, FileNode } from '@/type'
import { Icon } from '@/components'

interface Props {
  tree: FileTreeType
  fold: string[]
  setFold(fold: string[]): void
  style?: React.CSSProperties
}
export const FileTree = (props: Props) => {
  const { tree, fold, setFold, ...rest } = props

  const getTree = () => {
    const list: any[] = tree
      .filter((_: any) => Boolean(_?.name))
      .map((item: any) => {
        item.sortBy = item.name.charCodeAt(0)
        if (item.isDirectory) item.sortBy += 10000
        return item
      })
      .sort((a: any, b: any) => b.sortBy - a.sortBy)

    return list
  }
  const renderTree = getTree()

  return (
    <div className="file-tree" {...rest}>
      {renderTree.map((item: FileNode, i) => {
        const { statusCode, isDirectory, path } = item
        return (
          <div
            key={i}
            className="file-tree-item"
            data-fold={fold.includes(path)}
            data-status={statusCode}
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
                  const newFold = fold.includes(path)
                    ? fold.filter((_) => _ !== path)
                    : [path, ...fold]

                  setFold(newFold)
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
                  {item.name}
                </div>
              </div>
              <div className="flex items-center justify-center">
                {/* <div className='mr'>+</div> */}
                <div className="status text-14 bold pl flex items-center justify-center">
                  {statusCode === '??' ? 'U' : statusCode}
                </div>
              </div>
            </div>
            {item.children && (
              <div className="children" style={{ paddingLeft: 15 }}>
                <FileTree tree={item.children} fold={fold} setFold={setFold} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
