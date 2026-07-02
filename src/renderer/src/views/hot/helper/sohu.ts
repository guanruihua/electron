import { ObjectType } from '0type'
import { cheerio } from '@/util'

export const sohu = (html: string): ObjectType | void => {
  const $ = cheerio.load(html)
  const doms = $('.FS-important-news>.news-content>a')
  const list: any[] = []
  // console.log(doms)

  doms.each((_index, ele) => {
    const _ = $(ele)
    list.push({
      title: _.find('.chain-item-text>.text-info').text()?.trim(),
      url: _.attr('href'),
    })
  })
  // console.log(list)
  if (list.length)
    return {
      hot: list,
    }

  return
}
