import { useSetState } from '0hook'
import { WebviewTag } from 'electron'
import React from 'react'
import { ViewState } from '@/type'
import { setHeaderTitle, getSearchUrl, setupEventListeners } from '@/util'
import { ViewProps } from './index'

export const useViewState = (props: ViewProps) => {
  const { tab, h } = props
  const { id } = tab
  const { state, handle } = h
  const [viewState, setViewState] = useSetState<ViewState>({
    id,
    url: tab.url,
    search: '',
    title: '',
    contentsId: -1,
    canGoBack: false,
    canGoForward: false,
    home: true,
  })
  // console.log('🚀 ~ useViewState ~ viewState:', viewState)

  const ref = React.useRef<WebviewTag>(null)

  const handleView = {
    setViewState,
    async searchKeyDown(e) {
      if (e.key === 'Enter') {
        let url: string = viewState.search || ''
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          // const url = getSearchUrl('Baidu', value)
          url = getSearchUrl('Bing', url) || ''
        }
        const newViewState: ViewState = {
          ...viewState,
          home: false,
          url,
        }

        const webview: WebviewTag | null = ref.current
        if (webview && newViewState.url) {
          webview.src = newViewState.url
          webview.dataset.hidden = 'false'
        }

        setViewState(newViewState)
        handle.updateTabInfo({
          id,
          url,
        })
        // await sleep(500)
        load(newViewState)
      }
    },
    search(e) {
      const value: string = e.target.value || ''
      setViewState({
        search: value,
      })
    },
    goHome() {
      setViewState({ home: true, url: '', search: '' })
      // setHeaderTitle(id, 'Dashboard')

      const webview: WebviewTag | null = ref.current
      if (webview) {
        webview.src = ''
        webview.dataset.hidden = 'true'
      }
    },
    goBack: () => {
      if (viewState.home) setViewState({ home: false })
      ref.current?.goBack()
    },
    goForward: () => ref.current?.goForward(),
    reload: () => ref.current?.reload(),
    close: () => window.api.close(),
    min: () => window.api.minimize(),
    max: () => window.api.maximize(),
  }

  const load = (newViewState: ViewState = viewState) => {
    if (!ref.current) return
    const webview: WebviewTag = ref.current
    setupEventListeners(webview, newViewState, handle, handleView)
  }

  React.useEffect(() => {
    const newViewState: ViewState = {
      ...viewState,
      ...tab,
    }
    setViewState(newViewState)
    if (!tab.url) {
      // setHeaderTitle(id, 'Dashboard')
    }

    if (!ref.current) return
    const webview: WebviewTag = ref.current

    if (newViewState.url) {
      webview.src = newViewState.url
      webview.dataset.hidden = 'false'
      webview.addEventListener('dom-ready', () => {
        console.log('allow pasting')
        console.log('允许粘贴')
        console.log('Webview DOM 准备就绪')
        const id = webview.getWebContentsId()
        console.log(newViewState.url, id)
        newViewState.contentsId = id
        if (newViewState.url) {
          load(newViewState)
        }
      })
    }
  }, [id])

  // console.log(viewState)

  return {
    ref,
    viewState,
    handleView,
  }
}
