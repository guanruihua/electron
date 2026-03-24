import React from 'react'

import fileTree from './t.json'
import { FileTree } from './file-tree'
import './index.less'
import { Button } from 'antd'
import { useLoadings } from '@/util'
import { Icon } from '@/components'

export default function FileResourceManagement() {
  const [depth, setDepth] = React.useState<number>(1)
  const [open, setOpen] = React.useState<string[]>([])
  const [loadings, setLoadings] = useLoadings()
  // console.log(fileTree.children)
  const conf = {
    tree: fileTree.children,
    loadings,
    setLoadings,
    open,
    setOpen,
    depth,
    currentDepth: 0,
  }

  const init = async () => {
    const res = await window.api.invoke('getFileTree', { path: 'D:\\' })
    console.log(res)
    return
  }

  React.useEffect(() => {
    init()
  }, [])

  return (
    <div className="file-resource-management">
      {/*  */}
      <div className="file-resource-management-container">
        <div className="frm-tree frm-card relative">
          <FileTree {...conf} />
          <Button
            loading={loadings.reload}
            icon={<Icon type="reload" style={{ fontSize: 16 }} />}
            className="bolder absolute"
            style={{ top: 8, right: 10 }}
            onClick={() => setLoadings(init(), 'reload')}
          />
        </div>
        <div className="frm-card">
          <Button onClick={() => window.api.invoke('toggleDevTools')}>
            Devtool
          </Button>
        </div>
      </div>
    </div>
  )
}
