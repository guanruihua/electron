import './index.less'
import { useNavigate } from 'react-router-dom'
import { Div } from 'aurad'
// import { Icon } from './icons'

export interface HeaderProps {
  [key: string]: any
}

export function Header(props: HeaderProps) {
  const nav = useNavigate()

  const handle = {
    home() {
      nav('/')
    },
    close() {
      window.api.close()
    },
    min() {
      window.api.minimize()
    },
    max() {
      window.api.maximize()
    },
  }
  return (
    <Div className="main-layout-header" {...props}>
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
        <div className="main-layout-header-major-href">
          <div onClick={handle.home}>HOME</div>
          {/* <div className="gap">
            <Icon type="right" />
          </div> */}
          {/* <div className="last">
            {location.href.split('#')?.[1]?.replace(/^\//gi, '').toUpperCase()}
          </div> */}
          {/* <div className='last'>{location.href}</div> */}
        </div>
        <div className="main-layout-header-major-title"></div>
        <div className="main-layout-header-major-handle"></div>
      </div>
    </Div>
  )
}
