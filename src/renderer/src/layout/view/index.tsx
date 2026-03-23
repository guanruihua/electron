import { useViewState } from './state'
import { ViewState } from '@/type'
import { Bar } from './bar'
import DashboardView from '@/views/dashboard'
import FileResourceManagement from '@/views/File-Resource-Management'
import { ObjectType } from '0type'

export interface ViewProps{
  tab: ViewState
  h: ObjectType
}

export function View(props: ViewProps) {
  const { tab, h } = props
  const { id, type } = tab
  const { ref, viewState, handleView } = useViewState(props)

  return (
    <div className={'root-view'} data-hidden={id !== h.state.activeTab}>
      <Bar viewState={viewState} handleView={handleView} />
      <div className="root-view-content">
        {type === 'dashboard' && <DashboardView />}
        {type === 'fsm' && <FileResourceManagement />}
        {/* {!viewState.home && (
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
        )} */}
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
