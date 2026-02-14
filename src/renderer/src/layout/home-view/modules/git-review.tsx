import React from 'react'
import { Button } from 'antd'
import { FileTreeType, ModuleProps } from '../../type'
import { isString } from 'asura-eye'
import { getFileTree } from '@/layout/helper/get'
import { FileTree } from '@/layout/components'

export function GitReview(props: ModuleProps) {
  const { state, handle } = props.h
  const [msg, setMsg] = React.useState('')
  const [tree, setTree] = React.useState<FileTreeType>([])
  const [fold, setFold] = React.useState<string[]>([])

  return (
    <div className="root-layout-home-view-git-review">
      <div className="module-bg w flex gap col">
        <div className="flex space-between items-center">
          <h4>Git</h4>
          <div className="flex gap">
            <Button
              className="bolder"
              onClick={async () => {
                const res = await window.api.invoke(
                  'cmdResult',
                  // 'cd D:\\dev\\workspace\\docs\\electron && git diff && q',
                  // 'cd D:\\dev\\workspace\\docs\\electron && git diff --staged --name-status && q',
                  'cd D:\\dev\\workspace\\docs\\electron && git status --porcelain=v1 && q',
                  // 'cd D:\\dev\\workspace\\docs\\electron && git diff --name-only && q',
                )
                if (!isString(res)) return
                setMsg(res)
                const fileTree = getFileTree(res)
                console.log(fileTree)
                setTree(fileTree)
              }}
            >
              test
            </Button>
            <Button
              className="bolder"
              onClick={() => handle?.NodeThread?.findAll(true)}
            >
              Reload
            </Button>
          </div>
        </div>
        <div
          className="overflow-y bg border-radius p"
          style={{ maxHeight: `calc(var(--h) - 150px)` }}
        >
          {/* {msg} */}
          <FileTree tree={tree} fold={fold} setFold={setFold} />
        </div>
      </div>
    </div>
  )
}
