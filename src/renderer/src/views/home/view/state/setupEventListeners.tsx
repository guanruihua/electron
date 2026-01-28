const setTitle = (id: string, title: string) => {
  console.log('页面标题更新:', title)
  const dom = document.querySelector(
    `.main-layout-header-major-tab-item span[data-header-title-id="${id}"]`,
  )
  if (dom) dom.textContent = title
  // console.log('🚀 ~ webviewListener ~ dom:', dom)
}

export const setupEventListeners = (
  webview,
  tab,
  handle,
  setViewState,
) => {
  console.log('setupEventListeners')
  const { id, url } = tab
  // let count = 0
  // const timer = setInterval(() => {
  //   const title = webview?.getTitle?.()
  //   console.log(title)
  //   count++
  //   if (title) {
  //     clearInterval(timer)
  //   }
  //   if (count > 20) {
  //     clearInterval(timer)
  //   }
  // }, 500)

  const events = [
    'load-commit',
    'did-finish-load',
    'did-fail-load',
    'did-frame-finish-load',
    'did-start-loading',
    'did-stop-loading',
    'did-attach',
    // 'dom-ready',
    'page-title-updated',
    'page-favicon-updated',
    'enter-html-full-screen',
    'leave-html-full-screen',
    'console-message',
    'found-in-page',
    'will-navigate',
    'will-frame-navigate',
    'did-start-navigation',
    'did-redirect-navigation',
    'did-navigate',
    'did-frame-navigate',
    'did-navigate-in-page',
    'close',
    'ipc-message',
    'render-process-gone',
    'destroyed',
    'media-started-playing',
    'media-paused',
    'did-change-theme-color',
    // 'update-target-url',
    'devtools-open-url',
    'devtools-search-query',
    'devtools-opened',
    'devtools-closed',
    'devtools-focused',
    'context-menu',
  ]
  const newViewState = {
    id,
    url,
    search: url,
    title: webview?.getTitle?.() || 'Loading',
    canGoBack: false,
    canGoForward: false,
  }

  events.forEach((item) => {
    webview.addEventListener(item, () => {
      // if (item === 'page-favicon-updated') {
      //   const newTitle = webview?.getTitle?.()
      //   if (newViewState.title !== newTitle) {
      //     newViewState.title = newTitle
      //     setViewState(newViewState)
      //     setTitle(id, newViewState.title)
      //   }
      // }
      console.log(item, webview?.getTitle?.())
    })
  })

  // 1. 监听页面开始加载
  webview.addEventListener('did-start-loading', () => {
    // statusDiv.textContent = '状态: 正在加载...'
    console.log('开始加载页面')
  })

  // 2. 监听页面加载完成
  webview.addEventListener('did-stop-loading', () => {
    // statusDiv.textContent = '状态: 加载完成'
    const url = webview.getURL()
    // updateUrlDisplay(url)
    console.log('页面加载完成:', url)
    newViewState.url = url
    newViewState.search = url
    newViewState.title = webview?.getTitle?.()
    newViewState.canGoBack = webview?.canGoBack?.()
    newViewState.canGoForward = webview?.canGoForward?.()
    // console.log('🚀 ~ setupEventListeners ~ newViewState:', newViewState)
    setViewState(newViewState)
    setTitle(id, newViewState.title)
    handle.updateTabInfo(newViewState)
  })

  // 3. 监听页面标题变化
  webview.addEventListener('page-title-updated', (e) => {
    newViewState.title = e.title
    setTitle(id, e.title)
    handle.updateTabInfo(newViewState)
  })

  // 4. 监听 URL 变化（重定向时）
  webview.addEventListener('did-navigate', (e) => {
    console.log('页面导航到:', e.url)
    // addToHistory(e.url)
    // updateUrlDisplay(e.url)
  })

  // 5. 监听页面内导航（hash 变化等）
  webview.addEventListener('did-navigate-in-page', (e) => {
    console.log('页面内导航:', e.url)
    // updateUrlDisplay(e.url)
  })

  // 6. 监听加载失败
  webview.addEventListener('did-fail-load', (e) => {
    // statusDiv.textContent = '状态: 加载失败'
    console.error('页面加载失败:', {
      errorCode: e.errorCode,
      errorDescription: e.errorDescription,
      url: e.validatedURL,
    })
  })

  // 7. 监听加载进度
  webview.addEventListener('load-commit', (e) => {
    console.log('加载提交:', {
      url: e.url,
      isMainFrame: e.isMainFrame,
    })
  })

  // 8. 监听新窗口打开
  webview.addEventListener('new-window', (e) => {
    console.log('新窗口请求:', e.url)
    e.preventDefault() // 阻止默认行为

    // 在当前 webview 中打开
    // webview.loadURL(e.url)
  })

  // 9. 监听控制台消息
  // webview.addEventListener('console-message', (e) => {
  //   console.log(`Webview 控制台 [${e.level}]:`, e.message)
  // })

  function updateUrlDisplay(url) {
    // currentUrl = url
    // urlDisplay.textContent = `URL: ${url}`
    // urlInput.value = url
  }

  function addToHistory(url) {
    // 如果当前不是最新的历史记录，移除后面的记录
    // if (historyIndex < history.length - 1) {
    //   history = history.slice(0, historyIndex + 1)
    // }
    // history.push(url)
    // historyIndex++
    // console.log('历史记录:', history)
  }

  function reloadWebview() {
    webview.reload()
  }

  // // 监听键盘快捷键
  // document.addEventListener('keydown', (e) => {
  //   // if (e.ctrlKey && e.key === 'r') {
  //   //   e.preventDefault()
  //   //   reloadWebview()
  //   // } else if (e.ctrlKey && e.key === 'l') {
  //   //   e.preventDefault()
  //   //   // urlInput.select()
  //   // }
  // })

  // // 初始加载时获取 URL
  webview.addEventListener('did-finish-load', () => {
    console.log('🚀 ~ webviewListener ~ did-finish-load')

    // setTimeout(() => {
    //   const url = webview.getURL()
    //   updateUrlDisplay(url)
    //   addToHistory(url)
    // }, 100)
  })
}
