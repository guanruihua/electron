import { FileTreeType } from '../type'
import { Icon } from './icons'

interface Props {
  tree: FileTreeType
  fold: string[]
  setFold(fold: string[]): void
}
export const FileTree = (props: Props) => {
  const { tree, fold, setFold } = props
  return (
    <div className="file-tree">
      {tree
        .filter((_: any) => Boolean(_?.name))
        .sort((a: any, b: any) => b.name.charCodeAt(0) - a.name.charCodeAt(0))
        .map((item: FileTreeType[0], i) => {
          // console.log('@ ~ FileTree ~ item:', item)
          const { statusCode, isDirectory, path } = item
          return (
            <div key={i}>
              <div
                className="flex space-between px items-center"
                data-fold={fold.includes(path)}
                data-status={statusCode}
                data-dir={isDirectory}
                style={{ height: 24 }}
              >
                <div
                  className="flex row pointer"
                  onClick={() => {
                    if (fold.includes(path)) {
                      setFold(fold.filter((_) => _ !== path))
                      return
                    }
                    fold.push(path)
                    console.log(fold)
                    setFold(fold)
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
                <div>
                  <div className="status text-14 bold pl flex items-center justify-center">
                    {statusCode === '??' ? 'U' : statusCode}
                  </div>
                </div>
              </div>
              {item.children && (
                <div className="children" style={{ paddingLeft: 15 }}>
                  <FileTree
                    tree={item.children}
                    fold={fold}
                    setFold={setFold}
                  />
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}
