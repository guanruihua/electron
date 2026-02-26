import React from 'react'
import { Button } from 'antd'
import { FileTreeType, ModuleProps } from '../../type'
import { isString } from 'asura-eye'
import { Icon } from '../../components'
import { getFileTree } from '@/layout/helper/get'
import { FileTree } from '@/layout/components'

export function GitReview(props: ModuleProps) {
  const { state, handle } = props.h
  const { label = '', path } = state.selectGitModule || {}
  const [tree, setTree] = React.useState<FileTreeType>([])
  const [fold, setFold] = React.useState<string[]>([])

  const gitPull = async () => {
    const res = await window.api.invoke(
      'cmdResult',
      'cd ' + path + ' && git status --porcelain=v1 && q',
      // 'cd D:\\dev\\workspace\\docs\\electron && git status --porcelain=v1 && q',
    )
    if (!isString(res)) return
    const fileTree = getFileTree(res)
    console.log(fileTree)
    setTree(fileTree)
  }

  React.useEffect(() => {
    path && gitPull()
  }, [path])

  return (
    <div className="root-layout-home-view-git-review">
      <div className="module-bg w flex gap col">
        <div
          className="flex space-between items-center"
          style={{ paddingBottom: 20 }}
        >
          <div className="flex row gap">
            <Icon type="git" />
            <div className="bold text-14">{label}</div>
          </div>
          <div className="flex gap">
            <Button className="bolder" onClick={gitPull}>
              Pull
            </Button>
            <Button
              className="bolder"
              icon={<Icon type="reload" style={{ fontSize: 16 }} />}
              onClick={gitPull}
            />
          </div>
        </div>
        <div
          className="overflow-y bg border-radius p"
          style={{ maxHeight: `calc(var(--h) - 200px)` }}
        >
          <FileTree tree={tree} fold={fold} setFold={setFold} />
        </div>
      </div>
    </div>
  )
}
