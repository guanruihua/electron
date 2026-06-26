import { cheerio } from '@/util'

export const bili = (html: string) => {
  const $ = cheerio.load(html)
  const doms = $(
    '.bili-dyn-live-users .bili-dyn-live-users__body .bili-dyn-live-users__item',
  )
  const list: any[] = []
  doms.each((i, ele) => {
    const item = $(ele)
    const logo = item
      .find('.bili-dyn-live-users__item__face .b-img__inner img')
      .attr('src')
    const uname = item.find('.bili-dyn-live-users__item__uname').text()
    const title = item.find('.bili-dyn-live-users__item__title').text()
    const record = { i, logo, uname, title }
    list.push(record)
  })

  return {
    liveBroadcast: list,
  }
}
