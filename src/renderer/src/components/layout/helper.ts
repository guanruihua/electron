export const getCfg = (len: number, col: number = 1) => {
  const cfg: {
    total: number
    show: number[]
  }[] = new Array(col).fill('').map((_) => ({
    total: 0,
    show: [],
  }))
  if (col < 2) {
    return [
      {
        total: 1,
        show: new Array(len).fill('').map((_, i) => i),
      },
    ]
  }
  if (len <= col) {
    return cfg.map((item, i) => {
      item.total = 1
      item.show = [i]
      return item
    })
  }

  const getMinIndex = () => {
    let min = -1
    let index = -1
    for (let i = 0; i < cfg.length; i++) {
      const total = cfg[i].total
      if (total === 0) return i
      if (index === -1 || total < min) {
        min = total
        index = i
        continue
      }
    }
    return index || 0
  }

  for (let i = 0; i < len; i++) {
    const dom = document.querySelector(
      `.layout-grid>.layout-grid-col>.layout-grid-item[data-index="${i}"]`,
    )
    if (dom) {
      const h = dom.getBoundingClientRect().height
      const index = getMinIndex()
      cfg[index].total += h
      cfg[index].show.push(i)
    }
  }

  return cfg
}