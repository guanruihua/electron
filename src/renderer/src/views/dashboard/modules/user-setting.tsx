import { Button, Input } from 'antd'
import { ModuleProps } from '../type'
import { Form } from 'antd'
import React from 'react'
import { Icon } from '@/components'
import {
  getApps,
  getModules,
  getSetting,
  setStatus_NodeTread,
  toNodeTreads,
  useLoading,
} from '@/util'
import { isString } from 'asura-eye'

export function UserSetting(props: ModuleProps) {
  const { state, handle } = props.h
  const [form]: any[] = Form.useForm()
  const [loading, setLoading] = useLoading()
  const [edit, setEdit] = React.useState<boolean>(false)

  const init = async (force: boolean = false) => {
    const path = state?.sysSetting?.path
    if (!isString(path)) return
    if (!force) {
      if (!state.initSysSettingSuccess || state.initUserSettingSuccess) return
    }
    handle.setState({
      initUserSettingSuccess: false,
    })

    await window.api.invoke('fs', {
      action: 'createPathIfNotExist',
      payload: { path, isFile: false },
    })
    await window.api.invoke('fs', {
      action: 'createPathIfNotExist',
      payload: { path: path + '/setting.json', isFile: true },
    })
    await window.api.invoke('fs', {
      action: 'createPathIfNotExist',
      payload: { path: path + '/modules.json', isFile: true },
    })
    await window.api.invoke('fs', {
      action: 'createPathIfNotExist',
      payload: { path: path + '/apps.json', isFile: true },
    })

    const setting = await getSetting(path)
    const modules = await getModules(path)
    const apps = await getApps(path)

    if (setting && !setting?.selectGitModule?.path && modules?.[0]) {
      setting.selectProject = state?.modules?.[0] || {}
    }

    const res = await window.api.invoke('cmd', 'tasklist | findstr node')
    if (!isString(res)) {
      state.NodeTreads = []
    } else {
      state.NodeTreads = toNodeTreads(res) || []
    }

    handle.setState({
      initUserSettingSuccess: true,
      setting,
      modules,
      apps,
    })
    handle.renderState()

    setStatus_NodeTread(state.NodeTreads)
    form.setFieldsValue(setting)

    console.log('User Setting init Success...')
    return
  }

  React.useEffect(() => {
    init().catch(console.error)
  }, [state.initUserSettingSuccess, state.initSysSettingSuccess])

  const submit = async () => {
    try {
      const values = await form.validateFields()
      const newUserSetting = { ...state.setting, ...values }

      handle.setState({
        userSetting: newUserSetting,
      })
      handle.renderState()
      const path = state?.sysSetting?.path
      if (!path) return
      // console.log({ newUserSetting })
      await window.api.invoke('fs', {
        action: 'saveFile',
        payload: { path: path + '/setting.json', data: newUserSetting },
      })
      handle.success('User Setting Update Success...')
      return
    } catch (error) {
      handle.error('User Setting Update Error...', error)
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
          <h4>User Setting</h4>
          <div className="flex gap row">
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
            <Form.Item label="Ignore APP" name="ignoreApps">
              <Input.TextArea readOnly={!edit || loading} />
            </Form.Item>
            {edit && (
              <div className="flex gap pb">
                <Button
                  icon={<Icon type="save" />}
                  loading={loading}
                  htmlType="submit"
                  onClick={() => {
                    setLoading(submit())
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
