import { ObjectType } from '0type'
import { isString } from 'asura-eye'
import axios from 'axios'

const BaseURL = 'http://localhost:2400'
const Cache: ObjectType<any> = {}
export const req = async (
  method: 'get' | 'post',
  url: string,
  params?: ObjectType,
) => {
  try {
    const key = `${method}_${url}_${JSON.stringify(params)}`
    const cache = Cache[key]
    if (cache) {
      const { res, time } = cache
      if (Date.now() - time < 3000) {
        return res
      }
    }
    let res: any = {}

    if (isString(url) && !/^http/.test(url)) {
      url = BaseURL + (url[0] === '/' ? url : '/' + url)
    }
    if (method === 'get') res = await axios.get(url, params)
    if (method === 'post') res = await axios.post(url, params)

    Cache[key] = {
      time: Date.now(),
      res,
    }

    return res?.data
  } catch (error) {
    console.error(error)
    return {
      code: 500,
    }
  }
}
