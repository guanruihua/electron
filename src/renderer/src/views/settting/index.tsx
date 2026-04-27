import React from 'react'
import { useSysStore } from '@/store/sys'
import { Icon } from '@/components'
import { Button, Form } from 'antd'
import { useLoadings } from '@/util'
import './index.less'

export default function Setting() {
  const sys = useSysStore()
  const [loadings, setLoadings] = useLoadings()
  const [form]: any[] = Form.useForm()

  React.useEffect(() => {
    sys.set({ initSuccess: false })
    setLoadings(sys.init(true), 'init')
  }, [])

  React.useEffect(() => {
    sys.initSuccess && form.setFieldsValue(sys)
  }, [sys.initSuccess])

  console.log(sys)
  return (
    <div className="page__setting">
      <div className="header">
        <div className="flex gap">
          <Button
            loading={loadings.edit}
            icon={<Icon type="edit" />}
            onClick={() => {
              setLoadings(
                window.api.invoke('cmd', `code ${sys.path}\\setting.json`),
                'edit',
              )
            }}
          />
          <Button
            loading={loadings.init}
            icon={<Icon type="reload" style={{ fontSize: 16 }} />}
            className="bolder"
            onClick={() => setLoadings(sys.init(true), 'init')}
          />
        </div>
      </div>
      <div className="user-setting module-card">
        <Form form={form} layout="vertical">
          <div className="flex row">
            <Form.Item label="Total Modules">
              <div>{sys.modules?.length || 0}</div>
            </Form.Item>
            <Form.Item label="Total App">
              <div>{sys.apps?.length || 0}</div>
            </Form.Item>
          </div>
          <Form.Item label="Setting Path" name="path">
            <div>{sys.path}</div>
          </Form.Item>
          <Form.Item label="Ignore APP" name="ignoreApps">
            <div>{sys.ignoreApps}</div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
