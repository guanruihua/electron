// import { setTitle } from '@/assets'
import React from 'react'

export const usePageState = () => {
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (!ref.current) return
    const webview = ref.current
    // console.log(webview)

    const handleNavigate = (event: any) => {
      // console.log('页面跳转到:', event.url)
      // setTitle(event.url)
    }

    // 🔥 关键监听事件
    webview.addEventListener('did-navigate', handleNavigate)
    webview.addEventListener('did-navigate-in-page', handleNavigate)

    return () => {
      webview.removeEventListener('did-navigate', handleNavigate)
      webview.removeEventListener('did-navigate-in-page', handleNavigate)
    }
  }, [ref.current])

  return {
    ref,
  }
}
