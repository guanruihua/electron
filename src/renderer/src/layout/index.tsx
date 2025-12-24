import React from 'react'
import { Outlet } from 'react-router-dom'
import './index.less'
import { Header } from './header'
import 'aurad/dist/style.css'
import { MiniTool } from '@/views/mini-tool'

export function Layout() {
  const [type, setType] = React.useState(
    // '',
    'mini-tool',
  )
  const init = () => {
    window.api.onShortcut('mini-tool', (info) => {
      console.log(info)
      setType('mini-tool')
    })
  }

  React.useEffect(() => {
    console.log(location.hash)
    init()
  }, [])
  if (type === 'mini-tool') {
    return <MiniTool />
  }
  return (
    <div className="main-layout">
      <Header none={type === 'mini-tool'} />
      <Outlet />
    </div>
  )
}
