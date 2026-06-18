import { SysState, UserInfo } from '@/type'
import { tableName, DBName } from '../conf'
import { resolveWeather } from './weather/resolve-weather'
import dayjs from 'dayjs'

export const initUserInfo = async (newState: SysState) => {
  const date = dayjs().format('YYYY-MM-DD')
  const res = await window.api.db({
    action: 'find',
    tableName,
    DBName,
    payload: {
      uid: newState.userInfo.uid,
    },
  })
  let needUpdateDB: boolean = false

  const userInfo: UserInfo = res?.data?.at(0) || {}

  // uid
  if (!userInfo.uid) {
    needUpdateDB = true
    userInfo.uid = newState.userInfo.uid
  }

  // weatherInfo
  if (userInfo.date !== date || !userInfo.weatherInfo?.length) {
    needUpdateDB = true
    userInfo.weatherInfo = await resolveWeather()
    console.log(userInfo.weatherInfo)
    userInfo.date = date
    console.log('Weather info init Success')
  }

  // update
  if (needUpdateDB || res.error || !userInfo.id) {
    // const res_add =
    await window.api.db({
      action: 'update',
      tableName,
      DBName,
      payload: userInfo,
    })
    // console.log('res_add:', res_add)

    const res2 = await window.api.db({
      action: 'find',
      tableName,
      DBName,
      payload: {
        uid: userInfo.uid,
      },
    })
    // console.log('res2:', res2)
    const userInfo2 = res2?.data?.at(0) || {}

    if (!res2.error && userInfo2.uid === newState.userInfo.uid) {
      console.log('UserInfo init Success')
      newState.userInfo = {
        ...newState.userInfo,
        ...userInfo2,
      }
    } else {
      console.log('UserInfo init Error')
    }
  } else {
    newState.userInfo = {
      ...newState.userInfo,
      ...userInfo,
    }
    console.log('UserInfo init Success')
  }

  return
}
