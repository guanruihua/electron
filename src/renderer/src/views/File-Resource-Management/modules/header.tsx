import { AutoCompleteProps, Button } from 'antd'
import { Icon } from '@/components'
import { HandlePage, PageState } from '../helper'
import { Loadings } from '@/util'
import { Input } from 'aurad'
import { useState } from 'react'
import { AutoComplete } from 'antd'
import { isArray } from 'asura-eye'

type Props = {
  loadings: Loadings
  pageState: PageState
  handlePage: HandlePage
}

export function Header(props: Props) {
  const { loadings, pageState, handlePage } = props

  const [value, setValue] = useState('')
  const [options, setOptions] = useState<AutoCompleteProps['options']>([])

  const getPanelValue = (text) => {
    console.log(text, pageState.pathMap)

    if (!text) return pageState?.drives?.map((value) => ({ value }))
    if (text && pageState?.pathMap?.[text]?.length)
      return pageState.pathMap[text].map((_) => ({ value: _.path }))

    return []
  }

  const onSelect = (data: string) => {
    console.log('onSelect', data)
  }

  return (
    <div className="file-resource-management__header">
      <div>
        <span className="text-12 mr">{pageState.select?.path || ''}</span>
        <AutoComplete
          options={options}
          style={{ width: 200 }}
          onSelect={onSelect}
          showSearch={{
            onSearch: (text) => setOptions(getPanelValue(text)),
          }}
          placeholder="Input Path here ..."
        />
      </div>
      <div className="driver-box">
        {pageState?.drives?.map((item: string, i) => {
          return (
            <div
              key={i}
              className="driver-item"
              data-select={pageState?.selectDrive === item}
              onClick={() => handlePage.selectDriver(item)}
            >
              {/* <Icon type="disk" style={{ fontSize: 20 }} /> */}
              {item.replace(':\\', '')}
            </div>
          )
        })}
        <Button onClick={() => window.api.invoke('toggleDevTools')}>
          Devtool
        </Button>
        <Button
          loading={loadings.reload}
          icon={<Icon type="reload" style={{ fontSize: 16 }} />}
          className="bolder"
          onClick={() => handlePage.setLoadings(handlePage?.init?.(), 'reload')}
        />
      </div>
    </div>
  )
}
