import { useSetState } from '0hook'
import { WebviewTag } from 'electron'
import React from 'react'
import {} from 'harpe'
import { setupEventListeners } from './setupEventListeners'
import { sleep } from '@/util'

interface ViewState {
  id: string
  url: string
  search: string
  title: string
  canGoBack: boolean
  canGoForward: boolean
  [key: string]: any
}

export const useViewState = (props) => {
  const { state, info, id, handle } = props
  const tab = info[id] || {}

  const [viewState, setViewState] = useSetState<ViewState>({
    id,
    url: tab.url,
    search: '',
    title: '',
    canGoBack: false,
    canGoForward: false,
  })

  const ref = React.useRef<WebviewTag>(null)

  const load = () => {
    if (!ref.current) return
    const webview: WebviewTag = ref.current
    setupEventListeners(webview, viewState, handle, setViewState)
  }

  React.useEffect(() => {
    setViewState(tab)
    if (!ref.current) return
    const webview: WebviewTag = ref.current
    webview.addEventListener('dom-ready', () => {
      console.log('allow pasting')
      console.log('允许粘贴')
      console.log('Webview DOM 准备就绪')
      load()
    })
  }, [id])

  return {
    ref,
    viewState,
    setViewState,
    handleView: {
      async searchKeyDown(e) {
        if (e.key === 'Enter') {
          setViewState({
            id,
          })
          handle.updateTabInfo({
            id,
            url: viewState.search,
          })
          await sleep(500)
          load()
        }
      },
      search(e) {
        const value = e.target.value
        setViewState({
          search: value,
        })
      },
      goHome() {
        console.log('home')
      },
      goBack: () => ref.current?.goBack(),
      goForward: () => ref.current?.goForward(),
      reload: () => ref.current?.reload(),
      close: () => window.api.close(),
      min: () => window.api.minimize(),
      max: () => window.api.maximize(),
    },
  }
}
