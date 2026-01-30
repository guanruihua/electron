import { useViewState } from './state'
import { Input } from 'antd'
import { Icon } from '../components/icons'
import { classNames } from 'harpe'
import { HomeView } from '../home-view'
import { ViewProps } from '../type'

export function View(props: ViewProps) {
  const { state, id } = props
  const { ref, viewState, handleView } = useViewState(props)

  return (
    <div
      className={classNames('root-view', {
        hidden: id !== state.activeTab,
      })}
    >
      <div className="root-view-bar">
        <div className="left">
          <div
            data-disabled={viewState.canGoBack !== true}
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
      {viewState.url ? (
        <webview
          key={id}
          ref={ref}
          className="root-view-iframe"
          style={{ width: '100%', height: '100%' }}
          src={viewState.url}
          // nodeintegration
          plugins={'true' as any}
          allowpopups={'true' as any}
        ></webview>
      ) : (
        <HomeView {...props} />
      )}
    </div>
  )
}
