import { useViewState } from './state'
import { Input, Button } from 'antd'
import { Icon } from '../components/icons'
import { HomeView } from '../home-view'
import { ViewProps } from '../type'

export function View(props: ViewProps) {
  const { state, id } = props
  const { ref, viewState, handleView } = useViewState(props)

  return (
    <div className={'root-view'} data-hidden={id !== state.activeTab}>
      <div className="root-view-bar">
        <div className="left">
          <div
            data-disabled={viewState.canGoBack !== true && !viewState.home}
            onClick={handleView.goBack}
          >
            <Icon type="back" />
          </div>
          <div
            data-disabled={viewState.canGoForward !== true}
            onClick={handleView.goForward}
          >
            <Icon type="forward" />
          </div>
          <div onClick={handleView.reload}>
            <Icon type="reload" />
          </div>
          <div data-disabled={!viewState.url} onClick={handleView.goHome}>
            <Icon type="home" />
          </div>
        </div>
        <div className="center">
          <Input
            value={viewState.search}
            onChange={handleView.search}
            onKeyDown={handleView.searchKeyDown}
          />
        </div>
        <div></div>
      </div>
      <div className="root-view-content">
        <webview
          key={id}
          ref={ref}
          className="root-view-iframe"
          data-hidden="true"
          // src={undefined}
          // nodeintegration
          plugins={'true' as any}
          allowpopups={'true' as any}
        ></webview>
        {viewState.home && <HomeView {...props} />}
      </div>
      {/* <div className="dev-control fixed right bottom">
        <Button
          onClick={() => {
            window.api.invoke('toggleWebViewDevTools', viewState.contentsId)
          }}
        >
          Devtool B
        </Button>
        <Button
          onClick={() => {
            const webview = ref.current

            if (!webview) return
            webview.isDevToolsOpened()
              ? webview.closeDevTools()
              : webview.openDevTools()
          }}
        >
          Devtool
        </Button>
      </div> */}
    </div>
  )
}
