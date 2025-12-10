import './index.less'
import { usePageState } from './state'

export function WebViewPage() {
  const { ref } = usePageState()

  return (
    <div className="page__iframe">
      <webview
        ref={ref}
        className="page__iframe-iframe"
        style={{ width: '100%', height: '100%' }}
        // src="http://172.16.30.53/configuration/index"
        src="https://testapppulse.yessafe.com/login?redirect=/dashboard"
      ></webview>
    </div>
  )
}
