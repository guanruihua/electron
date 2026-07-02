import { isString } from 'asura-eye'
import { bili } from './bili'
import { jinjia } from './jinjia'
import { sohu } from './sohu'
import { zhihu_hot } from './zhihu'
import { jenkins } from './jenkins'

const url_jenkins = 'https://jenkins.yessafe.com.cn'

// uid:   'zhihu' | 'bili'
export const getWebViewRecord = (uid: string, html: string): any => {
  console.log(uid, html?.length)
  if (!isString(uid)) return
  if (uid.indexOf(url_jenkins) > -1) return jenkins(html)
  switch (uid) {
    case 'jinjia':
      return jinjia(html)
    case 'sohu':
      return sohu(html)
    case 'zhihu':
      return zhihu_hot(html)
    case 'bili':
      return bili(html)
    default:
      return
  }
}
