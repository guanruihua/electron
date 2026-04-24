import { ConfigProvider, theme } from 'antd'
import { usePageState } from './state'
import { Header } from './components/header'
import React from 'react'

import './style/root.less'
import './style/index.less'
import './style/header.less'
import './style/root-view.less'
import './style/data.less'
import './style/util/index.less'
import DashboardView from '@/views/dashboard'
import FileResourceManagement from '@/views/File-Resource-Management'
import TaskResourceManager from '@/views/Task-Resource-Manager'
import Other from '@/views/other'
// import TerminalPage from '@/views/terminal'
// import Agent from '@/views/agent'
// import { View } from '@/views/view'

const Routes = [
  {
    id: '01',
    type: 'dashboard',
    children: <DashboardView />,
    destroyOnHidden: false,
  },
  { id: '02', type: 'fsm', children: <FileResourceManagement /> },
  { id: '03', type: 'trm', children: <TaskResourceManager /> },
  { id: '99', type: 'other', children: <Other /> },
  // { type: 'terminal', children: <TerminalPage /> },
  // { type: 'agent', children: <Agent /> },
  // { type: 'agent', children: <View /> },
]
export default function Layout() {
  const h = usePageState()
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
          <div className="root-view">
            {/* <Bar viewState={viewState} handleView={handleView} /> */}
            <div className="root-view-bar" />

            <div className="root-view-content">
              {Routes.map((route) => {
                const { children, destroyOnHidden = true } = route
                if (route.id === activeTab || destroyOnHidden === false) {
                  return (
                    <div
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
