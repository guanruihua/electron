import { ObjectType } from '0type'
import { cheerio } from '@/util'

export const zhihu_hot = (html: string): ObjectType | void => {
  const $ = cheerio.load(html)
  const doms = $('.HotList-list>.HotItem')
  // console.log(doms)
  const list: any[] = []

  doms.each((_i, ele) => {
    const item = $(ele)
    const logo = item.find('.HotItem-img img').attr('src')
    const title = item.find('.HotItem-title').text()
    const url = item.find('.HotItem-content>a').attr('href')
    const excerpt = item.find('.HotItem-excerpt').text()
    const hot = item.find('.HotItem-metrics.HotItem-metrics--bottom').text()
    const record = { logo, title, excerpt, hot, url }
    list.push(record)
  })
  if (list.length)
    return {
      hot: list,
    }
  return
}
