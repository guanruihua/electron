import React from 'react'
import { DiagonalLoading, Icon } from '@/components'
import { Button, Switch } from 'antd'
import { usePageState } from './hook'
import { ClipboardItem } from './clipboard-item'
import ClipboardType from './clipboard-type'
import { getRenderList, openSettingFile } from './helper'
import { useSysStore } from '@/store/sys'
import './clipboard.less'
import './svg.less'

export function ClipboardManager() {
  const sys = useSysStore()
  const { handleSelf, clipboardState, pageState, loadings, context } =
    usePageState(sys)
  const { setLoadings } = handleSelf
  const { list = [] } = clipboardState
  const [width, setWidth] = React.useState(window.innerWidth)
  const [col, setCol] = React.useState(1)

  const  renderList = getRenderList(list, pageState)

  React.useEffect(() => {
    // 获取要监听的元素
    const element = document.querySelector('.clipboard-manager')
    if (!element) return

    // 创建 ResizeObserver 实例
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // 元素内容盒子的宽度（不含 padding/border）
        const width = entry.contentRect.width
        const newCol = Math.max(1, Math.floor(width / 450))
        setWidth(width)
        // console.log(width, newCol, col)
        setCol(newCol)
      }
    })

    // 开始监听
    resizeObserver.observe(element)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="clipboard-manager" data-disabled={!sys.path}>
      <div className="clipboard-manager-header w-layout-flex space-between p grid-span-full">
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
          className="clipboard-manager-container layout-grid scrollbar"
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
                <div
                  className="clipboard-manager-container-col"
                  key={`${col}_${width}_${ci}`}
                >
                  {renderList
                    .slice(0, 100)
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
            {/* <div className="vr-dom"></div> */}
          </>
        </div>
      )}
      {context}
    </div>
  )
}
