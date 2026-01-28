import { ObjectType } from '0type'
import { useViewState } from './state/index'
import { PageState } from '../type'
import { Input } from 'antd'
import { Icon } from '../components/icons'
import { classNames } from 'harpe'
import { HomeView } from '../home-view'

interface ViewProps {
  state: PageState
  setState(newState: ObjectType): void
  handle: ObjectType
  info: ObjectType
  id: string
}

export function View(props: ViewProps) {
  const { state, id, info } = props
  const { ref, viewState, handleView } = useViewState(props)

  return (
    <div
      className={classNames('page__iframe', {
        hidden: id !== state.activeTab,
      })}
    >
      <div className="page__iframe-bar">
        <div className="left">
          <div data-disabled={state.canGoBack} onClick={handleView.goBack}>
            <Icon type="back" />
          </div>
          <div
            data-disabled={state.canGoForward}
            onClick={handleView.goForward}
          >
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
          className="page__iframe-iframe"
          style={{ width: '100%', height: '100%' }}
          src={viewState.url}
          // nodeintegration
          plugins={'true' as any}
          allowpopups={'true' as any}
          // src="http://172.16.30.53/configuration/index"
          // src="https://testapppulse.yessafe.com/login?redirect=/dashboard"
        ></webview>
      ) : (
        <HomeView {...props} />
      )}
    </div>
  )
}
