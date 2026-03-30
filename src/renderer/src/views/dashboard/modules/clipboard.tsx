import { ObjectType } from '0type'
import { Icon } from '@/components'
import { ModuleProps } from '@/type'
import { getJSON, useLoadings } from '@/util'
import { Button } from 'antd'
import { isArray, isObject } from 'asura-eye'
import React from 'react'

export default function ClipboardDashboard(props: ModuleProps) {
  const { h } = props
  const { handle, state } = h

  const [edit, setEdit] = React.useState<boolean>(false)
  const [loadings, setLoadings] = useLoadings({
    edit: false,
    reload: false,
  })
  const [list, setList] = React.useState<ObjectType[]>([])

  const handleSelf = {
    updateList(payload: any) {
      const oldList: ObjectType[] = list || []
      console.log('list: ', oldList)
      let newList: ObjectType[] = []
      if (isObject(payload)) {
        newList = [payload, ...oldList]
      }

      if (isArray(payload)) {
        newList = payload
      }

      const DataCount: string[] = []
      // 清除重复的数据
      const newState: ObjectType[] = []

      newList.forEach((item) => {
        const flag = item.type === 'image' ? item.data.slice(0, 100) : item.data
        if (DataCount.includes(flag)) return
        newState.push(item)
        DataCount.push(flag)
      })

      setList(newState)

      const path = state?.sysSetting?.path
      if (!path) return
      window.api.invoke('fs', {
        action: 'saveFile',
        payload: {
          path: path + '/clipboard.json',
          data: JSON.stringify(newState, null, 2),
        },
      })
    },

    async del(item: ObjectType) {
      if (!isObject(item)) return
      console.log(item)
      const { type, data } = item
      this.updateList(
        list.filter((_) => {
          if (_.type !== type) return true
          if (_.type === 'image')
            return data.slice(0, 100) !== _.data.slice(0, 100)

          return data !== _.data
        }),
      )
    },
    async copy(item: ObjectType) {
      if (!isObject(item)) return
      const { type, data } = item
      const run = async () => {
        if (type === 'image') {
          const res = window.api.invoke('copy', {
            base64: data,
          })
          return res
        }
        if (type === 'text') {
          const res = window.api.invoke('copy', {
            data,
          })
          return res
        }
      }
      const res = await run()
      res ? handle.success('Copy Success...') : handle.error('Copy Error...')
      return false
    },

    async reload() {
      const path = state?.sysSetting?.path
      if (!path) return
      const list = getJSON(
        await window.api.invoke('fs', {
          action: 'readFile',
          payload: { path: path + '/clipboard.json' },
        }),
        [],
      )
      isArray(list) && setList(list)
      return
    },
  }

  const updateListRef = React.useRef((_v: any) => {})

  React.useEffect(() => {
    updateListRef.current = (data) => {
      handleSelf.updateList([data, ...list])
    }
  })

  React.useEffect(() => {
    if (state.initSysSettingSuccess && state.initUserSettingSuccess) {
      handleSelf.reload()
      const handler = (data) => updateListRef.current(data)
      window.api.on('clipboard-updated', handler)
      return () => {
        window.api.off('clipboard-updated', handler)
      }
    }
    return
  }, [state.initSysSettingSuccess, state.initUserSettingSuccess])

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
            <span className="flex items-center text-12 bold">
              Total: {list?.length || 0}
            </span>
            <Button
              icon={<Icon type="edit" />}
              loading={loadings.edit}
              onClick={() => setEdit((_) => !_)}
            />
            <Button
              loading={loadings.reload}
              icon={<Icon type="reload" style={{ fontSize: 16 }} />}
              className="bolder"
              onClick={() => setLoadings(handleSelf.reload(), 'reload')}
            />
          </div>
        </div>
        <div className="p" style={{ paddingTop: 10 }}>
          <div className="root-layout-home-view-modules-container overflow-y dashboard-module-container">
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
            {list.map((item, i) => {
              const { type, data } = item
              return (
                <div key={i} className="clipboard-item">
                  {type === 'image' && (
                    <div className="content image">
                      <img src={data} alt="image" />
                    </div>
                  )}
                  {type === 'text' && (
                    <div className="content text">{data}</div>
                  )}
                  <div className="btns">
                    {edit ? (
                      <Icon
                        className="remove"
                        type="close"
                        onClick={() => handleSelf.del(item)}
                      />
                    ) : (
                      <Icon
                        className="copy"
                        type="copy"
                        onClick={() => {
                          handleSelf.copy(item)
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
