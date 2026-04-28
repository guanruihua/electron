import { PageState, HandlePage } from '../../helper'
import './setting.less'
import { Input } from 'antd'

type Props = {
  pageState: PageState
  handlePage: HandlePage
}

export default function Setting(props: Props) {
  const { pageState, handlePage } = props
  const { setting = {} } = pageState || {}

  const Conf = [
    // { label: '仅包含文件夹', name: 'includeDir' },
    { label: '排除文件夹', name: 'excludeDir' },
    // { label: '仅包含文件', name: 'includeFile' },
    // { label: '排除文件', name: 'excludeFile' },
  ]

  const handleInput = (name: string, value: string) => {
    setting[name] = value
    handlePage.setPageState({ setting })
  }

  return (
    <div className="frm-setting frm-card" data-hidden={setting.show !== 1}>
      <div className="frm-setting-container">
        {Conf.map((item, i) => {
          const { label, name } = item
          return (
            <div key={i}>
              <div className="label">{label}</div>
              <Input.TextArea
                value={setting[name]}
                autoSize={{
                  minRows: 3,
                  maxRows: 20,
                }}
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
}
