import { bili } from './bili'
import { jinjia } from './jinjia'
import { sohu } from './sohu'
import { zhihu_hot } from './zhihu'

// uid:   'zhihu' | 'bili'
export const getWebViewRecord = (uid: string, html: string): any => {
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
