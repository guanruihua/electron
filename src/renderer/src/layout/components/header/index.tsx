import { Div } from 'aurad'
import { PageState } from '../../type'
import { Icon } from '../icons'

export interface HeaderProps {
  handle: {
    setState(newState: Partial<PageState>): void
    [key: string]: any
  }
  [key: string]: any
}

export function Header(props: HeaderProps) {
  const { state, setState, handle, ...rest } = props

  return (
    <Div className="root-header" {...rest}>
      <div className="root-header-control">
        <span
          className="root-header-control-close"
          onClick={handle.close}
        ></span>
        <span className="root-header-control-min" onClick={handle.min}></span>
        <span className="root-header-control-max" onClick={handle.max}></span>
      </div>
      <div className="root-header-tab">
        {state?.tabs?.map((id) => {
          return (
            <div
              key={id}
              className="root-header-tab-item"
              data-active={id === state.activeTab}
              data-id={id}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handle.setState({ activeTab: id })
              }}
            >
              <img className="logo" data-show="false" src="" />
              <span
                className="title"
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
                className="close"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handle.closeTab(id)
                }}
              >
                <Icon type="close" />
              </span>
            </div>
          )
        })}
        <div className="root-header-tab-item plus" onClick={handle.addTab}>
          <Icon type="add" />
        </div>
      </div>
      <div className="root-header-handle"></div>
    </Div>
  )
}
