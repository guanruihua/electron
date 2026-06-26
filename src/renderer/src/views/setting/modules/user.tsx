import React from 'react'
import { Icon } from '@/components'
import { Button, Form } from 'antd'
import { useSysStore } from '@/store/sys'
import { useLoadings } from '@/util'

export function User() {
  const sys = useSysStore()
  const [loadings, setLoadings] = useLoadings()
  const [form]: any[] = Form.useForm()

  React.useEffect(() => {
    if (sys.initSuccess && sys.path) {
      form.setFieldsValue(sys)
    }
  }, [sys.initSuccess, sys.path])

  return (
    <div className="user-setting relative layout-module">
      <div
        className="flex gap absolute"
        style={{
          top: 10,
          right: 10,
        }}
      >
        <Button
          loading={loadings.edit_env}
          icon={<Icon type="edit" />}
          onClick={() => {
            setLoadings(
              window.api.invoke('cmd', `code ${sys.path}\\env.json`),
              'edit_env',
            )
          }}
        >
          ENV
        </Button>
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
      <Form form={form} layout="vertical">
        <Form.Item label="Total Modules">
          <div>{sys.modules?.length || 0}</div>
        </Form.Item>
        <Form.Item label="Setting Path" name="path">
          <div>{sys.path}</div>
        </Form.Item>
        <Form.Item label="Ignore APP" name="ignoreApps">
          <div>{sys.ignoreApps}</div>
        </Form.Item>
      </Form>
    </div>
  )
}
