import { PageState, HandlePage } from '../../helper'
import './setting.less'
import { Input } from 'antd'

type Props = {
  pageState: PageState
  handlePage: HandlePage
}

export const Setting = (props: Props) => {
  const { pageState, handlePage } = props
  const { setting = {} } = pageState || {}

  const Conf = [
    {
      label: '文件夹',
      children: [
        // { label: '仅包含文件夹', name: 'includeDir' },
        { label: '排除文件夹', name: 'excludeDir' },
      ],
    },
    {
      label: '文件',
      children: [
        // { label: '仅包含文件', name: 'includeFile' },
        { label: '排除文件', name: 'excludeFile' },
        // { label: '排除文件后缀', name: 'excludeFilePre' },
        // { label: '排除文件后缀', name: 'excludeFileExt' },
      ],
    },
  ]

  const handleInput = (name: string, value: string) => {
    setting[name] = value
    handlePage.setPageState({ setting })
  }

  return (
    <div className="frm-setting frm-card">
      <div style={{ maxWidth: 250, whiteSpace: 'warp' }}>
        {JSON.stringify(setting)}
      </div>
      <div className="frm-setting-container">
        {Conf.map((module, mi) => {
          const { label, children } = module
          return (
            <div key={mi}>
              <h4 style={{ fontSize: 14 }}>{label}</h4>
              <div className="children">
                {children.map((item, i) => {
                  const { label, name } = item
                  return (
                    <div key={i}>
                      <div className="label">{label}</div>
                      <Input.TextArea
                        value={setting[name]}
                        styles={{
                          textarea: {
                            minWidth: 200,
                            maxWidth: 250,
                          },
                        }}
                        onInput={(e) => handleInput(name, e.target.value)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
