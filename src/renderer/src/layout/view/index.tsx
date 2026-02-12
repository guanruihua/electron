import { useViewState } from './state'
import { HomeView } from '../home-view'
import { ViewProps } from '../type'
import { Bar } from './bar'

export function View(props: ViewProps) {
  const { state, id } = props
  const { ref, viewState, handleView } = useViewState(props)

  return (
    <div className={'root-view'} data-hidden={id !== state.activeTab}>
      <Bar viewState={viewState} handleView={handleView} />
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
