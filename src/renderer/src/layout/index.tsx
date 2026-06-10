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

export default function Layout() {
  const h = usePageState()
  const { tabs, state, handle, ly } = h
  const { activeTab } = h.state
  const col = ly.innerCol || 1

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
            <div
              className="root-aside-item switch-screen-size"
              onClick={() => {
                const newCol = col === 3 ? 1 : col + 1
                window.api.invoke('setSize', { width: 500 * newCol })
                if (ly.innerCol !== newCol) ly.set({ innerCol: newCol })
              }}
            >
              <div
                className="logo"
                style={{
                  gridTemplateColumns: new Array(col || 2)
                    .fill('1fr')
                    .join(' '),
                }}
              >
                {new Array(col || 2).fill('').map((_, i) => (
                  <div
                    key={state.col + '_' + i}
                    className="switch-screen-size-render"
                  />
                ))}
              </div>
            </div>
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
