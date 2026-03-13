import React from 'react'
import { Button } from 'antd'
import { FileTreeType, ModuleProps } from '../../type'
import { isString } from 'asura-eye'
import { Icon } from '../../components'
import { getFileTree } from '@/layout/helper/get'
import { FileTree } from '@/layout/components'
import { Input } from 'antd'

export function GitReview(
  props: ModuleProps & { left: React.ReactNode; right: React.ReactNode },
) {
  const { h, left, right } = props
  const { state, handle } = h
  const { label = '', path } = state?.setting?.selectGitModule || {}
  const [tree, setTree] = React.useState<FileTreeType>([])
  const [fold, setFold] = React.useState<string[]>([])

  const [commitMsg, setCommitMsg] = React.useState<string>(
    'feat: Improve documentation',
  )

  const [loading, setLoading] = React.useState<boolean>(false)
  const Loading = (p: Promise<any>) => {
    setLoading(true)
    p?.finally(() => setLoading(false))
  }

  const gitPull = async () => {
    const res = await window.api.invoke(
      'cmdResult',
      `cd ${path} && git status --porcelain=v1 && q`,
    )
    console.log(res)
    if (!isString(res)) return setTree([])
    const fileTree = getFileTree(res) || []
    console.log(fileTree)
    return setTree(fileTree)
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
    path && gitPull()
  }, [path])

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
              onClick={() => Loading(gitPull())}
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
                <FileTree tree={tree} fold={fold} setFold={setFold} />
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
              onClick={handlePush}
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
