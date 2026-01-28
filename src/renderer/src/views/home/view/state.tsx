import { useSetState } from '0hook'
import { WebviewTag } from 'electron'
import React from 'react'

interface ViewState {
  url: string
  search: string
  title: string
  canGoBack: boolean
  canGoForward: boolean
  [key: string]: any
}

export const useViewState = (tab: any) => {
  const [viewState, setViewState] = useSetState<ViewState>({
    url: '',
    search: '',
    title: '',
    canGoBack: false,
    canGoForward: false,
  })

  const ref = React.useRef<WebviewTag>(null)

  const initState = () => {
    if (!ref.current) return
    const webview: WebviewTag = ref.current
    try {
      const url = webview?.getURL?.()
      setViewState({
        url,
        search: url,
        title: webview?.getTitle?.(),
        canGoBack: webview?.canGoBack?.(),
        canGoForward: webview?.canGoForward?.(),
      })
      console.log(viewState)
    } catch (error) {
      console.log(error)
    }
  }
  React.useEffect(() => {
    if (!ref.current) return
    const webview: WebviewTag = ref.current
    let timer: NodeJS.Timeout | null = null
    const load = () => {
      const loading = webview?.isLoading?.()
      if (loading) {
        timer = setTimeout(() => {
          load()
        }, 200)
      } else {
        timer && clearTimeout(timer)
        initState()
      }
    }
    if (!tab?.url) return

    webview.addEventListener('dom-ready', () => {
      // console.log('dom-ready', tab.url)
      // webview.loadURL(tab.url)
      initState()
    })

    // const handleNavigate = (event: any) => {
    //   console.log('页面跳转到:', event.url)
    //   // setTitle(event.url)
    // }

    // 🔥 关键监听事件
    // webview.addEventListener('did-navigate', handleNavigate)
    // webview.addEventListener('did-navigate-in-page', handleNavigate)

    return () => {
      timer && clearTimeout(timer)
      // webview.removeEventListener('did-navigate', handleNavigate)
      // webview.removeEventListener('did-navigate-in-page', handleNavigate)
    }
  }, [tab?.id, tab?.url])

  // console.log(ref.current?.getURL())

  return {
    ref,
    viewState,
    setViewState,
    handleView: {
      close() {
        window.api.close()
      },
      min() {
        window.api.minimize()
      },
      max() {
        window.api.maximize()
      },
      goHome() {
        console.log('home')
      },
      goBack() {
        ref.current?.goBack()
      },
      goForward() {
        ref.current?.goForward()
      },
      reload() {
        ref.current?.reload()
      },
      search(e) {
        console.log(e.target.value)
      },
    },
  }
}
