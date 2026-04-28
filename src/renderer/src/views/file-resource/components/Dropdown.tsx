import { MenuProps } from 'antd'
import { ReactNode } from 'react'
import { FileNode } from '../helper'
import { Dropdown } from 'antd'
import './Dropdown.less'
import { Modal } from 'antd'
import { FRMStore } from '../store'

type FRM_DropdownProps = {
  file: FileNode
  frm: FRMStore
  children: ReactNode
}

export default function FRM_Dropdown(props: FRM_DropdownProps) {
  const { file, children, frm } = props
  const { path, type = 'file' } = file || {}
  const [modal, contextHolder] = Modal.useModal()

  const items: MenuProps['items'] = [
    {
      key: 'vscode-open',
      label: 'VS Code 打开',
      onClick: () => window.api.invoke('cmd', `code ${path}`),
    },
    {
      key: 'frm-open',
      label: '文件资源打开',
      onClick: () => window.api.invoke('cmd', `explorer "${path}"`),
    },
    type === 'dir' && {
      key: 'cmd-open',
      label: '终端打开',
      onClick: () => {
        window.api.invoke('cmd', `start cmd /k "cd /d \"${path}\""`)
      },
    },
    {
      key: 'del',
      label: '删除',
      onClick: () => {
        modal?.confirm({
          title: '确定要删除该文件/夹?',
          async onOk() {
            window.api.invoke('cmd', `rimraf ${path}`)
          },
        })
      },
    },
  ].filter(Boolean) as MenuProps['items']

  return (
    <>
      <Dropdown
        className="frm-dropdown"
        classNames={{
          root: 'frm-dropdown-root',
        }}
        menu={{
          items,
        }}
        trigger={['contextMenu']}
        destroyOnHidden
        placement="bottomRight"
      >
        {children}
      </Dropdown>
      {contextHolder}
    </>
  )
}
