import { ObjectType } from '0type'
import { State } from '@/type'
import { getJSON } from './get'

export const getModules = async (path: string) =>
  getJSON(
    await window.api.invoke('fs', {
      action: 'readFile',
      payload: { path: path + '/modules.json' },
    }),
    [],
  )

export const getApps = async (path: string) =>
  getJSON(
    await window.api.invoke('fs', {
      action: 'readFile',
      payload: { path: path + '/apps.json' },
    }),
    [],
  )

export const getSetting = async (path: string) =>
  getJSON(
    await window.api.invoke('fs', {
      action: 'readFile',
      payload: { path: path + '/setting.json' },
    }),
    {},
  ) as State['setting']

export const saveSettingToFile = async (
  path: string,
  setting: State['setting'],
) =>
  getJSON(
    await window.api.invoke('fs', {
      action: 'saveFile',
      payload: { path: path + '/setting.json', data: setting },
    }),
    {},
  ) as State['setting']
