import React from 'react'
import { Button, Input, Form, Space } from 'antd'
import { isString } from 'asura-eye'
import { ModuleProps } from '../type'
import { Icon } from '@/components'
import { getJSON, useLoading } from '@/util'
// import { useSysStore } from '@/store/sys'

export function SysSetting(props: ModuleProps) {
  // const sys = useSysStore()
  // console.log(sys)
  const { state, handle } = props.h
  const [form]: any[] = Form.useForm()
  const [loading, setLoading] = useLoading()
  const [edit, setEdit] = React.useState<boolean>(false)

  const getSysSettingPath = async () => {
    const res = await window.api.invoke('getUserDataPath')
    if (!isString(res)) return
    await window.api.invoke('fs', {
      action: 'createPathIfNotExist',
      payload: { path: res + '\\Cache\\electron', isFile: false },
    })
    const sysSettingPath = res + '\\Cache\\electron\\setting.json'

    await window.api.invoke('fs', {
      action: 'createPathIfNotExist',
      payload: { path: sysSettingPath, isFile: true },
    })

    return sysSettingPath
  }

  const init = async (force: boolean = false) => {
    if (!force) {
      if (state.initSysSettingSuccess) return
    }
    handle.setState({ initSysSettingSuccess: false })
    
    const sysSettingPath = await getSysSettingPath()
    if (!sysSettingPath) return
    const sysSetting = getJSON(
      await window.api.invoke('fs', {
        action: 'readFile',
        payload: { path: sysSettingPath },
      }),
      {
        path: 'D:\\Data\\electron',
      },
    )
    handle.setState({ sysSetting, initSysSettingSuccess: true })
    handle.renderState()

    form.setFieldsValue(sysSetting)
    console.log('System Setting init Success...')
  }

  React.useEffect(() => {
    init()
  }, [state.initSysSettingSuccess])

  const submit = async () => {
    try {
      const values = await form.validateFields()
      const newSysSetting = {
        ...state.sysSetting,
        ...values,
      }
      handle.setState({
        sysSetting: newSysSetting,
      })
      handle.renderState()

      const sysSettingPath = await getSysSettingPath()

      await window.api.invoke('fs', {
        action: 'saveFile',
        payload: { path: sysSettingPath, data: newSysSetting },
      })
      handle.success('System Setting Update Success...')
      return
    } catch (error) {
      handle.error('System Setting Update Error...', error)
      return
    }
  }

  return (
    <div
      className="root-layout-home-view-setting"
      data-disabled={!state?.sysSetting?.path}
    >
      <div className="module-bg w flex gap col" style={{ paddingBottom: 0 }}>
        <div className="flex space-between items-center">
          <h4>System Setting</h4>
          <div className="flex gap">
            <Button
              icon={<Icon type="edit" />}
              onClick={() => setEdit((v) => !v)}
            />
            <Button
              loading={loading}
              icon={<Icon type="reload" style={{ fontSize: 16 }} />}
              className="bolder"
              onClick={() => setLoading(init(true))}
            />
          </div>
        </div>
        <div style={{ zoom: '.9', paddingTop: 10 }}>
          <Form form={form} layout="vertical">
            <Form.Item label={'Setting Path'} data-form-name={'path'}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                  noStyle
                  name={'path'}
                  rules={[{ message: 'It cannot be empty.', required: true }]}
                >
                  <Input readOnly={loading || !edit} />
                </Form.Item>
                <Space.Addon className="badge-status" data-type="1">
                  <Icon className="status-1" type="badge-success" />
                  <Icon className="status-2" type="badge-warning" />
                  <Icon className="status-3" type="badge-error" />
                </Space.Addon>
              </Space.Compact>
            </Form.Item>
            {edit && (
              <div className="flex gap pb">
                <Button
                  icon={<Icon type="save" />}
                  loading={loading}
                  htmlType="submit"
                  onClick={() => {
                    setLoading(submit())
                    setEdit(false)
                  }}
                >
                  Save
                </Button>
                <Button
                  icon={<Icon type="reload" />}
                  loading={loading}
                  onClick={() => form.setFieldsValue(state?.setting || {})}
                >
                  Reset
                </Button>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  )
}
