import { Button, Input } from 'antd'
import { FileTree } from './file-tree'
import { Icon } from '@/components'
import { usePageState } from './hook'
import './git-review.less'
import { AutoComplete } from 'antd'
import { useSysStore } from '@/store/sys'
import { ProjectConf } from '@/type'
import { Switch } from 'antd'

export function GitReview({ item }: { item: ProjectConf }) {
  const sys = useSysStore()

  const {
    init,
    loading,
    label,
    fold,
    setFold,
    handlePush,
    pageState,
    setPageState,
  } = usePageState(item)

  const { simpleTree, tree, commitMsg, hty_options } = pageState

  return (
    <div className="git-review" data-hidden={item?.git === false}>
      <div className="flex gap row items-center space-between git-review-header ">
        <div className="flex row gap">
          <Icon type="git" />
          <div className="bold text-14">{label}</div>
        </div>
        <div className="flex gap items-center">
          <Switch
            checked={pageState.detail}
            checkedChildren="Detail"
            unCheckedChildren="Summarize"
            onChange={(val) => setPageState({ detail: val })}
          />
          <Button
            title="Pull"
            loading={loading}
            className="bolder"
            icon={<Icon type="reload" style={{ fontSize: 16 }} />}
            onClick={() => init()}
          />
        </div>
      </div>
      <div className="git-review-container git-container">
        <div className="controls">
          <AutoComplete
            options={hty_options}
            onSelect={(value: string = '') => {
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
        {pageState.detail ? (
          <div
            className="overflow-y border-radius"
            style={{
              minHeight: 50,
              maxHeight: `calc(var(--h) - 100px)`,
              padding: 10,
            }}
          >
            {tree?.length ? (
              <FileTree tree={simpleTree || []} fold={fold} setFold={setFold} />
            ) : (
              <div
                className="text-12 text-center"
                style={{ color: '#eee', paddingTop: 10 }}
              >
                No Data
              </div>
            )}
          </div>
        ) : (
          <div className="repo-status">
            <div className="update">
              Update: {pageState?.repoStatus?.M || 0}
            </div>
            <div className="add">Add: {pageState?.repoStatus?.A || 0}</div>
            <div className="delete">
              Delete: {pageState?.repoStatus?.D || 0}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
