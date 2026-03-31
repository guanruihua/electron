import { Icon } from '@/components'
import { ModuleProps } from '@/type'
import { Button } from 'antd'
import './clipboard.less'
import './svg.less'
import { usePageState } from './hook'
import { ClipboardItem } from './clipboard-item'
import ClipboardType from './clipboard-type'
import { openSettingFile } from './helper'

export default function ClipboardDashboard(props: ModuleProps) {
  const { state, handleSelf, pageState, loadings } = usePageState(props)
  const { setLoadings } = handleSelf
  const { list = [], renderList = [] } = pageState
  return (
    <div
      className="root-layout-home-view-modules dashboard-clipboard"
      data-disabled={!state?.sysSetting?.path}
    >
      <div className="module-bg" style={{ padding: 0 }}>
        <div
          className="flex space-between items-center mb"
          style={{ padding: '20px 20px 0' }}
        >
          <h4>Clipboard</h4>
          <div className="flex gap">
            <Button
              icon={<Icon type="edit" />}
              loading={loadings.editFile}
              onClick={() => setLoadings(openSettingFile(state), 'editFile')}
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
        <div className="p" style={{ paddingTop: 10 }}>
          <ClipboardType pageState={pageState}  handleSelf={handleSelf}>
            <span className="flex items-center text-12 bold">
              Total: {list?.length || 0}
            </span>
            <Button
              disabled={!list?.length}
              icon={<Icon type="edit" />}
              loading={loadings.edit}
              onClick={() => 
                handleSelf.setPageState({
                  edit: !pageState?.edit,
                })
              }
            >
              Setting
            </Button>
          </ClipboardType>
          <div className="dashboard-clipboard-container">
            {!list.length && (
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  lineHeight: '80px',
                }}
              >
                Empty
              </div>
            )}
            {renderList.map((item, i) => (
              <ClipboardItem
                key={i}
                item={item}
                pageState={pageState}
                handleSelf={handleSelf}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
