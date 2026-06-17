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
  if (isString(url) && !/^http/.test(url)) {
    url = BaseURL + (url[0] === '/' ? url : '/' + url)
  }
  const key = `${method}_${url}_${JSON.stringify(params)}`
  const cache = Cache[key]
  if (cache) {
    const { data, time, status } = cache
    if (
      status === 'queue' ||
      (status === 'success' && Date.now() - time < 5000)
    ) {
      return {
        status,
        data,
      }
    }
  } else {
    Cache[key] = {
      status: 'queue',
      time: Date.now(),
      data: undefined,
    }
  }

  try {
    let res: any = {}

    if (method === 'get') res = await axios.get(url, params)
    if (method === 'post') res = await axios.post(url, params)
    const data = res?.data || res
  
    Cache[key] = {
      time: Date.now(),
      code: 200,
      data,
    }
    // console.log('req: ',res?.data)

    return {
      status: 'success',
      data,
    }
  } catch (error) {
    console.error(error)
    Cache[key] = {
      time: -1,
      status: 'error',
      data: undefined,
    }

    return {
      status: 'error',
    }
  }
}
