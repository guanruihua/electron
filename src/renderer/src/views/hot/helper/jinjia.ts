import { cheerio } from '@/util'

export const jinjia = (html: string) => {
  const $ = cheerio.load(html)
  const list: any[] = []
  // const dom = $('.mian .bg .list:nth-child(0)').eq(1)
  const doms = $('.mian>.left>.bg')

  // console.log('doms: ', doms)

  doms.each((_i, ele) => {
    const _ = $(ele)
    const title = _.children('h2').text() || _.children('h1').text()
    const _list = _.find('.list>ul>li')
    const data: any[] = []
    _list.each((_j, li) => {
      const _li = $(li)
      if (_i === 0 && _j > 1) return
      if (_i === 1 && _j > 1) return
      if (_i === 2) {
        data.push({
          title: _li.find('.name>b>a').text(),
          new: _li.find('.new>span').text(),
          rise: _li.find('.open>span').eq(0).text(),
        })
        return
      }
      data.push({
        title: _li.find('.name>b>a').text(),
        new: _li.find('.new>span').text(),
        rise: _li.find('.rise>span').text(),
      })
    })

    if (data.length)
      list.push({
        title,
        data: data.slice(1),
      })
  })
  // console.log('list: ', list)
  return {
    hot: list,
  }
}
