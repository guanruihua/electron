import { ObjectType } from '0type'
import { useViewState } from './state'
import { PageState } from '../type'
import { Input } from 'antd'
import { Icon } from '../components/icons'

interface ViewProps {
  state: PageState
  setState(newState: ObjectType): void
  handle: ObjectType
}

export function View(props: ViewProps) {
  const { state, setState, handle } = props
  const tab = state?.tabs?.find((tab) => tab.id === state.activeTab)
  const { ref, viewState, handleView } = useViewState(tab)

  if (!tab?.id) {
    return <div>404</div>
  }

  return (
    <div className="page__iframe">
      <div className="page__iframe-bar">
        <div className="left">
          <div data-disabled={state.canGoBack} onClick={handleView.goBack}>
            <Icon type="back" />
          </div>
          <div data-disabled={state.canGoForward} onClick={handleView.goForward}>
            <Icon type="forward" />
          </div>
          <div onClick={handleView.reload}>
            <Icon type="reload" />
          </div>
          <div>
            <Icon type="home" />
          </div>
        </div>
        <div className="center">
          <Input value={viewState.search} onChange={handleView.search} />
        </div>
        <div></div>
      </div>
      <webview
        ref={ref}
        className="page__iframe-iframe"
        style={{ width: '100%', height: '100%' }}
        // src="https://www.baidu.com"
        // src="https://www.bing.com"
        // src="http://172.16.30.53:5173/discovery"
        // src="http://172.16.30.53:5173/discovery"
        src={tab.url}
        key={tab.url}
        // nodeintegration
        plugins={'true' as any}
        allowpopups={'true' as any}
        // src="http://172.16.30.53/configuration/index"
        // src="https://testapppulse.yessafe.com/login?redirect=/dashboard"
      ></webview>
    </div>
  )
}
