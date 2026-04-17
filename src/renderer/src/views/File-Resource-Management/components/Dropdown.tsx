import { MenuProps } from 'antd'
import { ReactNode } from 'react'
import { FileNode, HandlePage, PageState } from '../helper'
import { Dropdown } from 'antd'
import './Dropdown.less'

type FRM_DropdownProps = Partial<{
  file: FileNode
  pageState: PageState
  handlePage: HandlePage
  children: ReactNode
}>

export default function FRM_Dropdown(props: FRM_DropdownProps) {
  const { file, children, handlePage } = props
  const { path, type = 'file' } = file || {}
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
    {
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
        handlePage?.modal?.error({
          title: '确定要删除该文件/夹?',
        })
        // window.api.invoke('cmd', `rimraf ${path}`)
      },
    },
  ].filter(Boolean)

  return (
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
  )
}
