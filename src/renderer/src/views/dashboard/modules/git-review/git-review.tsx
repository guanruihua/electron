import React from 'react'
import { Button, Input } from 'antd'
import { FileTreeType, ModuleProps } from '@/type'
import { isString } from 'asura-eye'
import { getFileTree, simplifyFileTree, useLoading } from '@/util'
import { FileTree } from './file-tree'
import { Icon } from '@/components'

export function GitReview(
  props: ModuleProps & { left: React.ReactNode; right: React.ReactNode },
) {
  const { h, left, right } = props
  const { state } = h
  const { label = '', path } = state?.setting?.selectGitModule || {}
  const [tree, setTree] = React.useState<FileTreeType>([])
  const [simpleTree, setSimpleTree] = React.useState<FileTreeType>([])
  const [fold, setFold] = React.useState<string[]>([])

  const [commitMsg, setCommitMsg] = React.useState<string>(
    'feat: Improve documentation',
  )

  const [loading, setLoading] = useLoading(false)

  const gitPull = async () => {
    const res = await window.api.invoke(
      'cmdResult',
      `cd ${path} && git status --porcelain=v1 -M1 && q`,
    )
    // console.log('git status: ', res)

    if (!isString(res)) {
      setTree([])
      setSimpleTree([])
      return
    }
    const fileTree = getFileTree(res) || []
    setTree(fileTree)
    setSimpleTree(simplifyFileTree(fileTree))

    // const history = await window.api.invoke(
    //   'cmdResult',
    //   `cd ${path} && git log && q`,
    // )
    // console.log('git history', history)
    return
  }

  const handlePush = async () => {
    const res = await window.api.invoke(
      'cmd',
      'cd ' + path + ' && git pull && q',
    )
    // console.log('Push: ', res)
    if (res) {
      const res2 = await window.api.invoke(
        'cmd',
        `cd ${path} && git add . && git commit -m "feat: ${commitMsg}" && git push && q`,
      )
      // console.log(res2)
      res2 && (await gitPull())
    }
    return
  }

  React.useEffect(() => {
    path && setLoading(gitPull())
  }, [path])

  // console.log('tree', simplifyFileTree(tree))

  return (
    <div className="root-layout-home-view-git-review">
      <div className="module-bg w flex gap col root-layout-home-view-git-review-module-bg">
        <div
          className="flex space-between items-center"
          style={{ paddingBottom: 20 }}
        >
          <div className="flex row gap">
            <Icon type="git" />
            <div className="bold text-14">{label}</div>
          </div>
          <div className="flex gap">
            <Button
              title="Pull"
              loading={loading}
              className="bolder"
              icon={<Icon type="reload" style={{ fontSize: 16 }} />}
              onClick={() => setLoading(gitPull())}
            />
          </div>
        </div>
      </div>
      <div className="root-layout-home-view-git-review-container">
        <div className="left">
          <div className="git-container p border-radius">
            <div
              className="overflow-y bg border-radius"
              style={{
                minHeight: 100,
                maxHeight: `calc(var(--h) - 200px)`,
                padding: 10,
              }}
            >
              {tree?.length ? (
                <FileTree tree={simpleTree} fold={fold} setFold={setFold} />
              ) : (
                <div
                  className="text-12 text-center"
                  style={{ color: '#eee', paddingTop: 30 }}
                >
                  No Data
                </div>
              )}
            </div>
          </div>
          <div className="left-children">{left}</div>
        </div>
        <div className="right">
          <div className="controls">
            <Input.TextArea
              readOnly={loading}
              autoSize={{ minRows: 1, maxRows: 10 }}
              value={commitMsg}
              onChange={(e) => {
                const value = e.target.value
                setCommitMsg(value)
              }}
            />
            <Button
              loading={loading}
              icon={<Icon type="check" style={{ fontSize: 16 }} />}
              onClick={() => setLoading(handlePush())}
            >
              Push
            </Button>
          </div>
          <div className="right-children">{right}</div>
        </div>
      </div>
    </div>
  )
}
