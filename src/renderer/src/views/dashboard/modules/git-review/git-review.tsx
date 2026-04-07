import { Button, Input } from 'antd'
import { ModuleProps } from '@/type'
import { FileTree } from './file-tree'
import { Icon } from '@/components'
import { usePageState } from './hook'
import './git-review.less'
import { AutoComplete } from 'antd'

export function GitReview(props: ModuleProps) {
  const { h } = props

  const {
    init,
    loading,
    label,
    fold,
    setFold,
    handlePush,
    pageState,
    setPageState,
  } = usePageState(h)

  const { simpleTree, tree, commitMsg, hty_options } = pageState

  return (
    <div
      className="root-layout-home-view-git-review"
      data-hidden={h.state?.setting?.selectProject?.git === false}
    >
      <div className="module-bg w flex gap col root-layout-home-view-git-review-module-bg">
        <div
          className="flex space-between items-center"
          style={{ paddingBottom: 10 }}
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
              onClick={() => init()}
            />
          </div>
        </div>
      </div>
      <div className="root-layout-home-view-git-review-container">
        <div className="git-container p border-radius">
          <div className="controls">
            <AutoComplete
              options={hty_options}
              onSelect={(value) => {
                setPageState({
                  commitMsg: value || '',
                })
              }}
            >
              <Input.TextArea
                readOnly={loading}
                autoSize={{ minRows: 1, maxRows: 10 }}
                value={commitMsg}
                onChange={(e) => {
                  const value = e.target.value
                  setPageState({
                    commitMsg: value || '',
                  })
                }}
              />
            </AutoComplete>
            <Button
              loading={loading}
              icon={<Icon type="check" style={{ fontSize: 16 }} />}
              onClick={() => handlePush()}
            >
              Push
            </Button>
          </div>
          <div
            className="overflow-y bg border-radius"
            style={{
              minHeight: 100,
              maxHeight: `calc(var(--h) - 200px)`,
              padding: 10,
            }}
          >
            {tree?.length ? (
              <FileTree tree={simpleTree || []} fold={fold} setFold={setFold} />
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
      </div>
    </div>
  )
}
