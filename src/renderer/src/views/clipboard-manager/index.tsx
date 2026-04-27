import { Icon } from '@/components'
import { Button } from 'antd'
import './clipboard.less'
import './svg.less'
import { usePageState } from './hook'
import { ClipboardItem } from './clipboard-item'
import ClipboardType from './clipboard-type'
import { openSettingFile } from './helper'
import { useSysStore } from '@/store/sys'
import { useState } from 'react'

export function ClipboardManager() {
  const sys = useSysStore()
  const { handleSelf, pageState, loadings, context } = usePageState(sys)
  const { setLoadings } = handleSelf
  const { list = [], renderList = [] } = pageState

  const [col, setCol] = useState(4)

  return (
    <div className="dashboard-clipboard" data-disabled={!sys.path}>
      <div
        className="flex space-between items-center mb"
        style={{ padding: '20px 20px 0' }}
      >
        <h4>Clipboard</h4>
        <div className="flex gap">
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
      <div className="p" style={{ paddingTop: 10 }}>
        <ClipboardType pageState={pageState} handleSelf={handleSelf}>
          <span className="flex items-center text-10 bold">
            Total: {list?.length || 0}
          </span>
        </ClipboardType>
        <div
          className="dashboard-clipboard-container"
          style={{
            gridTemplateColumns: new Array(col).fill('1fr').join(' '),
          }}
        >
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
              <div className="dashboard-clipboard-container-col" key={ci}>
                {renderList
                  .filter((_, i) => (i + 1) % col === ci)
                  .map((item, i) => (
                    <ClipboardItem
                      key={i}
                      item={item}
                      pageState={pageState}
                      handleSelf={handleSelf}
                    />
                  ))}
              </div>
            )
          })}
        </div>
      </div>
      {context}
    </div>
  )
}
