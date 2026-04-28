import React from 'react'
import { Button, AutoComplete } from 'antd'
import { Icon } from '@/components'
import { Loadings, SetLoadings } from '@/util'
import { useFRMStore } from '../../store'
import './header.less'

type Props = {
  loadings: Loadings
  setLoadings: SetLoadings
}

export function Header(props: Props) {
  const frm = useFRMStore()
  const { loadings, setLoadings } = props

  const { pathMap, setting = {} } = frm
  const paths = frm?.headerPaths || []

  return (
    <div className="file-resource-management__header">
      <div className="frm__header-left">
        <div className="frm__header-path">
          {paths?.map((item, i) => {
            const { value, dataKey } = item
            const options =
              pathMap?.[dataKey]
                ?.filter((_) => _?.type !== 'file')
                .map((item) => {
                  item.value = item.name
                  return item
                }) || []
            if (!value && !options.length) {
              return <React.Fragment key={i} />
            }
            return (
              <React.Fragment key={i}>
                <div data-hidden={i === 0} className="text-12 mr">
                  \
                </div>
                <AutoComplete
                  options={options}
                  classNames={{
                    root: 'frm-path-item',
                    popup: {
                      root: 'frm-path-item-popup',
                    },
                  }}
                  onSelect={(_, option: any) => {
                    frm.selectFileNode(option)
                  }}
                >
                  <div className="frm-path-item-value">{value}</div>
                </AutoComplete>
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <div className="frm__header-right">
        {/* <Input
          value={input}
          onChange={(e) => {
            const value = e.target.value || ''
            setInput(value)
          }}
          onPressEnter={(e) => {
            const value = e.target.value || ''
            console.log(value)
          }}
        /> */}
        <Button
          loading={loadings.reload}
          icon={<Icon type="reload" style={{ fontSize: 16 }} />}
          className="bolder"
          onClick={() => setLoadings(frm?.init?.(), 'reload')}
        />
        <Button
          icon={
            <Icon
              type={setting.showInfo === 1 ? 'eye' : 'eye-close'}
              style={{ fontSize: 16 }}
            />
          }
          className="bolder"
          type={setting.showInfo === 1 ? 'primary' : 'default'}
          onClick={() => {
            setting.showInfo = setting.showInfo === 1 ? 0 : 1
            frm.set({ setting })
          }}
        />
        <Button
          icon={<Icon type="setting" style={{ fontSize: 16 }} />}
          className="bolder"
          type={setting.show === 1 ? 'primary' : 'default'}
          onClick={() => {
            setting.show = setting.show === 1 ? 0 : 1
            frm.set({ setting })
          }}
        />
      </div>
    </div>
  )
}
