import { useSetState } from '0hook'
import { WebviewTag } from 'electron'
import React from 'react'
import {} from 'harpe'
import { setupEventListeners } from './helper/setupEventListeners'
import { sleep } from '@/util'
import { ViewProps, ViewState } from '../type'
import { setHeaderTitle } from './helper'

export const useViewState = (props: ViewProps) => {
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

  const handleView = {
    setViewState,
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
  }

  const load = () => {
    if (!ref.current) return
    const webview: WebviewTag = ref.current
    setupEventListeners(webview, viewState, handle, handleView)
  }

  React.useEffect(() => {
    setViewState(tab)
    if(!tab.url){
      setHeaderTitle(id, 'Home')
    }
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
    handleView,
  }
}
