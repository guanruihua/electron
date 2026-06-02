import { Div } from 'aurad'
import { State } from '@/type'
import { Icon } from '@/components'

export interface HeaderProps {
  handle: {
    setState(newState: Partial<State>): void
    [key: string]: any
  }
  [key: string]: any
}

export function Header(props: HeaderProps) {
  const { tabs, state, setState, handle, ...rest } = props

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
      <div className="root-header-handle"></div>
      <div className="root-header-right">
        <div
          className="root-header-right-dev"
          onClick={() => window.api.invoke('toggleDevTools')}
        >
          Devtool
        </div>
        <div
          className="root-header-right-reload"
          onClick={() => {
            sessionStorage.clear()
            window.location.reload()
          }}
        >
          <Icon type="reload" />
        </div>
      </div>
    </Div>
  )
}
