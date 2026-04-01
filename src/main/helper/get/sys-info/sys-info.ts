import { isArray, isString } from 'asura-eye'
import { getLocalIP } from './ip'
import { powerMonitor } from 'electron'

function getInfoByName(target: string): any {
  try {
    if (isString(target)) {
      switch (target.trim().toUpperCase()) {
        case 'LocalIP'.toUpperCase():
          return getLocalIP()
        case 'BatteryPower'.toUpperCase():
          return powerMonitor.onBatteryPower
        default:
          break
      }
      return
    }
    return
  } catch (error) {
    return
  }
}

export async function getSysInfo(_, target: any): Promise<any> {
  // console.log('getSysInfo: ', target)
  try {
    if (isString(target)) {
      if (target.indexOf(',') > -1) return target.split(',').map(getInfoByName)
      return getInfoByName(target)
    }
    if (isArray<string>(target)) return target.map(getInfoByName)
    return undefined
  } catch (error) {
    return undefined
  }
}
