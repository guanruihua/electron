import { DiagonalLoading, Icon } from '@/components'
import { Button, Switch } from 'antd'
import { usePageState } from './hook'
import { ClipboardItem } from './clipboard-item'
import ClipboardType from './clipboard-type'
import { openSettingFile } from './helper'
import { useSysStore } from '@/store/sys'
import './clipboard.less'
import './svg.less'

export function ClipboardManager() {
  const sys = useSysStore()
  const { handleSelf, clipboardState, pageState, loadings, context } =
    usePageState(sys)
  const { setLoadings } = handleSelf
  const { list = [], renderList = [] } = clipboardState
  // const [col, setCol] = useState(4)
  const col = 1

  return (
    <div className="clipboard-manager" data-disabled={!sys.path}>
      <div className="clipboard-manager-header w-layout-flex space-between p">
        <div className="left layout-flex justify-start">
          <ClipboardType
            clipboardState={clipboardState}
            pageState={pageState}
            handleSelf={handleSelf}
          />
          <span className="layout-flex text-10 bold">
            Total: {list?.length || 0}
          </span>
        </div>
        <div className="right layout-flex justify-end">
          <Switch
            checked={pageState.enable}
            checkedChildren={'Enabled'}
            unCheckedChildren={'Disabled'}
            onChange={(enable) => handleSelf.setPageState({ enable })}
          />
          <Button
            icon={<Icon type="edit" />}
            loading={loadings.editFile}
            onClick={() => setLoadings(openSettingFile(sys.path), 'editFile')}
          >
            File
          </Button>
          <Button
            icon={<Icon type="del" />}
            loading={loadings.edit}
            onClick={() => handleSelf.updateList([])}
          >
            Clear All
          </Button>
          <Button
            loading={loadings.reload}
            icon={<Icon type="reload" style={{ fontSize: 16 }} />}
            className="bolder"
            onClick={() => setLoadings(handleSelf.reload(), 'reload')}
          />
        </div>
      </div>
      {loadings.init ? (
        <DiagonalLoading />
      ) : (
        <div
          className="clipboard-manager-container layout-grid"
          style={{
            gridTemplateColumns: new Array(col).fill('1fr').join(' '),
          }}
        >
          <>
            {!list.length && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  width: '100%',
                  textAlign: 'center',
                  lineHeight: '80px',
                }}
              >
                Empty
              </div>
            )}
            {new Array(col).fill('').map((_, ci) => {
              return (
                <div className="clipboard-manager-container-col scrollbar" key={ci}>
                  {renderList
                    .filter((_, i) => i % col === ci)
                    .map((item) => (
                      <ClipboardItem
                        key={item.id}
                        item={item}
                        pageState={pageState}
                        handleSelf={handleSelf}
                      />
                    ))}
                </div>
              )
            })}
          </>
        </div>
      )}
      {context}
    </div>
  )
}
