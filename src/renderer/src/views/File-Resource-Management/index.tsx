import React from 'react'

import fileTree from './t.json'
import { FileTree } from './file-tree'
import './index.less'
import { Button } from 'antd'

export default function FileResourceManagement() {
  const [depth, setDepth] = React.useState<number>(1)
  const [open, setOpen] = React.useState<string[]>([])
  // console.log(fileTree.children)
  const conf = {
    tree: fileTree.children,
    open,
    setOpen,
    depth,
    currentDepth: 0,
  }

  return (
    <div className="file-resource-management">
      {/*  */}
      <div className="file-resource-management-container">
        <div className="frm-tree frm-card">
          <FileTree {...conf} />
        </div>
        <div className='frm-card'>
          <Button onClick={() => window.api.invoke('toggleDevTools')}>
            Devtool
          </Button>
        </div>
      </div>
    </div>
  )
}
