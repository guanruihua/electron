import './style/var.less'
import './style/root.less'
import './style/index.less'
import './style/header.less'
import './style/root-view.less'
import './style/data.less'
import './style/util/index.less'

import { ConfigProvider, theme } from 'antd'
import { usePageState } from './state'
import { Header } from './components/header'
import React from 'react'
import DashboardView from '@/views/dashboard'
// import FileResourceManagement from '@/views/file-resource'
import TaskResourceManager from '@/views/task-resource'
import Setting from '@/views/setting'
import { ClipboardManager } from '@/views/clipboard'
import MusicPlayer from '@/views/music/music'
import { ViewState } from '@/type'
import { Logo } from './components/logo'
import Project from '@/views/project/project'
import App from '@/views/app/app'
// import TerminalPage from '@/views/terminal'
// import { View } from '@/views/view'



const Routes = [
  {
    id: '01',
    type: 'dashboard',
    children: <DashboardView />,
    destroyOnHidden: false,
  },
  // { id: '02', type: 'fsm', children: <FileResourceManagement /> },
  { id: '02', type: 'project', children: <Project /> },
  { id: '03', type: 'app', children: <App /> },
  { id: '200', type: 'trm', children: <TaskResourceManager /> },
  {
    id: '04',
    type: 'clipboard',
    children: <ClipboardManager />,
    destroyOnHidden: false,
  },
  {
    id: '05',
    type: 'music-player',
    children: <MusicPlayer />,
    destroyOnHidden: false,
  },
  { id: '100', type: 'setting', children: <Setting />, destroyOnHidden: false },
  // { type: 'terminal', children: <TerminalPage /> },
  // { type: 'agent', children: <View /> },
]
export default function Layout() {
  const h = usePageState()
  const { tabs, state, handle } = h
  const { activeTab } = h.state
  // console.log(activeTab)

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div className="root-layout">
        <Header {...h} />
        <div className="root-view-container">
          <div className="root-aside">
            {tabs?.map((tab: ViewState) => {
              const { id, title, type } = tab
              return (
                <div
                  key={id}
                  className="root-aside-item"
                  data-active={id === state.activeTab}
                  data-id={id}
                  title={title || type}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    handle.setState({ activeTab: id })
                    handle.renderState()
                  }}
                >
                  {Logo[type] || Logo.dashboard}
                </div>
              )
            })}
          </div>
          <div className="root-view">
            <div className="root-view-content">
              {Routes.map((route) => {
                const { children, destroyOnHidden = true } = route
                if (route.id === activeTab || destroyOnHidden === false) {
                  return (
                    <div
                      className="root-view-item"
                      key={route.type}
                      data-hidden-render={
                        route.id !== activeTab && destroyOnHidden === false
                      }
                    >
                      {children}
                    </div>
                  )
                }
                return <React.Fragment key={route.type} />
              })}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}
