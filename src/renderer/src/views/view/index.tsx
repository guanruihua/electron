import { useViewState } from './state'
import { ViewState } from '@/type'
// import { Bar } from './bar'
import { ObjectType } from '0type'

export interface ViewProps {
  tab: ViewState
  h: ObjectType
}

export function View(props: ViewProps) {
  const { tab, h } = props
  const { id, type } = tab
  // console.log(h.state.activeTab, id)
  const { ref, viewState, handleView } = useViewState(props)
  return (
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
  )
}
