export const setHeaderTitle = (id?: string, title: string = 'Home') => {
  if (!id) return
  // console.log('页面标题更新:', title)
  const dom = document.querySelector(
    `.root-header-tab-item[data-id="${id}"] .title`,
  )
  if (dom && title !== dom.textContent) {
    dom.textContent = title || 'Home'
  }
}

export const setHeaderIcon = (id?: string, url: string = '') => {
  if (!id) return
  // console.log('页面logo更新:', url)
  const dom: HTMLImageElement | null = document.querySelector(
    `.root-header-tab-item[data-id="${id}"] .logo`,
  )
  if (dom) {
    dom.src !== url && (dom.src = url)
    dom.dataset.show !== 'true' && (dom.dataset.show = 'true')
  }
}

// export const set
