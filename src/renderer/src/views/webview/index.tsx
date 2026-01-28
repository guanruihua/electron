import { Input } from 'antd'
import { Icon } from './components/icons'
import './index.less'
import { usePageState } from './state'

export function WebViewPage() {
  const { ref, state, setState, handle } = usePageState()

  return (
    <div className="page__iframe">
      <div className="page__iframe-bar">
        <div className="left">
          <Icon
            type="back"
            disabled={state.canGoBack}
            onClick={handle.goBack}
          />
          <Icon
            type="forward"
            disabled={state.canGoForward}
            onClick={handle.goForward}
          />
          <Icon type="reload" onClick={handle.reload} />
          <Icon type="home" />
        </div>
        <div className="center">
          <Input value={state.search} onChange={handle.search} />
          {/* {state.title} */}
        </div>
        <div></div>
      </div>
      <webview
        ref={ref}
        className="page__iframe-iframe"
        style={{ width: '100%', height: '100%' }}
        // src="https://www.baidu.com"
        // src="https://www.bing.com"
        src="http://172.16.30.53:5173/discovery"
        nodeintegration
        plugins
        allowpopups
        // src="http://172.16.30.53/configuration/index"
        // src="https://testapppulse.yessafe.com/login?redirect=/dashboard"
      ></webview>
      {/* <iframe
        className="page__iframe-iframe"
        id="myIframe"
        src="https://www.bing.com"
        sandbox="allow-scripts allow-same-origin"
      ></iframe> */}
    </div>
  )
}
