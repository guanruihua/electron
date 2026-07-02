import { ObjectType } from '0type'
import { cheerio } from '@/util'
import dayjs from 'dayjs'

export const jenkins = (html: string): ObjectType | void => {
  const $ = cheerio.load(html)
  const doms = $('.jenkins-pane>tbody>tr.build-row>td')

  const list: any[] = []

  doms.slice(0, 3).each((_i, ele) => {
    // if(_i > 2) return
    const item = $(ele)

    let status = 'idle'
    const tmp_status = item
      .find(
        '.build-row-cell .build-icon .build-status-link .build-status-icon__wrapper',
      )
      .attr('class')
    if (tmp_status) {
      if (tmp_status.includes('icon-blue')) {
        status = 'success'
      }
      if (tmp_status.includes('icon-red')) {
        status = 'error'
      }
    }
    const time = item.find('.build-row-cell .build-details.block').attr('time')
    const name = item
      .find('.build-row-cell .build-name .display-name')
      .text()
      .trim()

    list.push({
      status,
      name,
      time: time ? dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss') : '',
    })
  })

  // console.log(html)
  // console.log(list)
  if (list.length)
    return {
      list,
    }
  return
}
