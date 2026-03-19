import { Button, Input } from 'antd'
import { ModuleProps } from '../../type'
import { Form } from 'antd'
import React from 'react'
import { Space } from 'antd'
import { Icon } from '../../components'
import { useLoading } from '@/util'

export function Setting(props: ModuleProps) {
  const { state, handle } = props.h
  const [form]: any[] = Form.useForm()
  const [loading, setLoading] = useLoading()
  React.useEffect(() => {
    form.setFieldsValue(state?.setting || {})
  }, [])

  const submit = async () => {
    try {
      const values = await form.validateFields()
      return await handle.handleSaveSetting(values)
    } catch (error) {
      console.log('@ ~ handleSave ~ error:', error)
      return
    }
  }
  const reload = async () => {
    return handle?.NodeThread?.findAll(true)
  }

  return (
    <div className="root-layout-home-view-setting">
      <div className="module-bg w flex gap col">
        <div className="flex space-between items-center">
          <h4>Setting</h4>
          <div className="flex gap">
            <Button
              loading={loading}
              icon={<Icon type="reload" style={{ fontSize: 16 }} />}
              className="bolder"
              onClick={() => setLoading(reload())}
            />
          </div>
        </div>
        <div style={{ zoom: '.9', paddingTop: 20 }}>
          <Form form={form} layout="vertical">
            <Form.Item label={'Setting Path'} data-form-name={'path'}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                  noStyle
                  name={'path'}
                  rules={[{ message: 'It cannot be empty.', required: true }]}
                >
                  <Input readOnly={loading} />
                </Form.Item>
                <Space.Addon className="badge-status" data-type="1">
                  <Icon className="status-1" type="badge-success" />
                  <Icon className="status-2" type="badge-warning" />
                  <Icon className="status-3" type="badge-error" />
                </Space.Addon>
              </Space.Compact>
            </Form.Item>
            <div className="flex gap">
              <Button
                loading={loading}
                htmlType="submit"
                onClick={() => {
                  setLoading(submit())
                }}
              >
                Save
              </Button>
              <Button
                loading={loading}
                onClick={() => form.setFieldsValue(state?.setting || {})}
              >
                Reset
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
