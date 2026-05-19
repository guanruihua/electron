import { ObjectType } from '0type'
import { isString } from 'asura-eye'
import axios from 'axios'

const BaseURL = 'http://localhost:2400'
export const req = async (
  method: 'get' | 'post',
  url: string,
  params?: ObjectType,
) => {
  try {
    let res: any = {}
    if (isString(url) && !/^http/.test(url)) {
      url = BaseURL + (url[0] === '/' ? url : '/' + url)
    }
    if (method === 'get') res = await axios.get(url, params)
    if (method === 'post') res = await axios.post(url, params)
    return res?.data
  } catch (error) {
    console.error(error)
    return {
      code: 500,
    }
  }
}
