import { Div } from 'aurad'
import { ObjectType } from '0type'
import './index.less'
import { PageState } from '../../type'

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
            {state?.tabs?.map((tab) => {
              return (
                <div
                  key={tab.id}
                  className="main-layout-header-major-tab-item"
                  data-active={tab.id === state.activeTab}
                  onClick={() => setState({ activeTab: tab.id })}
                >
                  {tab.title}
                </div>
              )
            })}
          </div>
        </div>
        <div className="main-layout-header-major-handle"></div>
      </div>
    </Div>
  )
}
