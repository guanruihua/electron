import { Input, Button } from 'antd'
import { Icon } from '../components/icons'

export function Bar({ viewState, handleView }) {
  return (
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
  )
}
