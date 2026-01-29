import { Div } from 'aurad'
import { ObjectType } from '0type'
import './index.less'
import { PageState } from '../../type'
import { Icon } from '../icons'

export interface HeaderProps {
  handle: ObjectType
  setState(newState: Partial<PageState>): void
  [key: string]: any
}

export function Header(props: HeaderProps) {
  const { state, setState, handle, ...rest } = props

  return (
    <Div className="main-layout-header" {...rest}>
      <div className="main-layout-header-major">
        <div className="main-layout-header-major-control">
          <span
            className="main-layout-header-major-control-close"
            onClick={handle.close}
          ></span>
          <span
            className="main-layout-header-major-control-min"
            onClick={handle.min}
          ></span>
          <span
            className="main-layout-header-major-control-max"
            onClick={handle.max}
          ></span>
        </div>
        <div className="main-layout-header-major-tabs">
          <div className="main-layout-header-major-tabs-container">
            {state?.tabs?.map((id) => {
              return (
                <div
                  key={id}
                  className="main-layout-header-major-tab-item"
                  data-active={id === state.activeTab}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setState({ activeTab: id })
                  }}
                >
                  <span className="header-tab-item-box">
                    <span
                      data-header-title-id={id}
                      style={{
                        maxWidth: 200,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        transition: 'all .3s',
                      }}
                    >
                      Loading...
                    </span>
                    <span
                      className="header-tab-item-box-close"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handle.closeTab(id)
                      }}
                    >
                      <Icon type="close" />
                    </span>
                  </span>
                </div>
              )
            })}
            <div
              className="main-layout-header-major-tab-item plus"
              onClick={handle.addTab}
            >
              <span>+</span>
            </div>
          </div>
        </div>
        <div className="main-layout-header-major-handle"></div>
      </div>
    </Div>
  )
}
