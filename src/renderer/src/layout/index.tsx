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
import { ViewState } from '@/type'
import { Logo } from './components/logo'
import { Routes } from './routes'
import { useSysStore } from '@/store/sys'

export default function Layout() {
  const h = usePageState()
  const sys = useSysStore()
  const activeTab = sys?.userInfo?.setting?.activeTab || '01'

  React.useEffect(() => {
    sys.init()
  }, [])

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
            {Routes?.map((tab: ViewState) => {
              const { id, title, type } = tab
              return (
                <div
                  key={id}
                  className="root-aside-item"
                  data-active={id === activeTab}
                  data-id={id}
                  title={title || type}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    sys.setUserInfo(
                      {
                        activeTab: id,
                      },
                      'setting',
                    )
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
