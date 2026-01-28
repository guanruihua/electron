import { useSetState } from '0hook'
import { WebviewTag } from 'electron'
import React from 'react'

interface PageState {
  url: string
  search: string
  title: string
  canGoBack: boolean
  canGoForward: boolean
  [key: string]: any
}

export const usePageState = () => {
  const [state, setState] = useSetState<PageState>({
    url: '',
    search: '',
    title: '',
    canGoBack: false,
    canGoForward: false,
  })
  const ref = React.useRef<WebviewTag>(null)
  React.useEffect(() => {
    if (!ref.current) return
    const webview: WebviewTag = ref.current
    // console.log(webview)

    if (!webview) return
    const url = webview.getURL()
    setState({
      url,
      search: url,
      title: webview.getTitle(),
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
    })
    const handleNavigate = (event: any) => {
      console.log('页面跳转到:', event.url)
      // setTitle(event.url)
    }

    // 🔥 关键监听事件
    webview.addEventListener('did-navigate', handleNavigate)
    webview.addEventListener('did-navigate-in-page', handleNavigate)

    return () => {
      webview.removeEventListener('did-navigate', handleNavigate)
      webview.removeEventListener('did-navigate-in-page', handleNavigate)
    }
  }, [])

  console.log(ref.current?.getURL())

  return {
    ref,
    state,
    setState,
    handle: {
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
