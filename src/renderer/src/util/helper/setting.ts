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

export const handleSetting = async (
  values: ObjectType,
): Promise<Partial<State>> => {
  try {
    const { path } = values
    if (!path) return { code: -1 }

    await window.api.invoke('fs', {
      action: 'createPathIfNotExist',
      payload: { path, isFile: false },
    })
    await window.api.invoke('fs', {
      action: 'createPathIfNotExist',
      payload: { path: path + '/setting.json', isFile: true },
    })
    await window.api.invoke('fs', {
      action: 'createPathIfNotExist',
      payload: { path: path + '/modules.json', isFile: true },
    })
    await window.api.invoke('fs', {
      action: 'createPathIfNotExist',
      payload: { path: path + '/apps.json', isFile: true },
    })

    const Default = {
      path,
      quickStarts: [],
    }
    const setting = await getSetting(path)
    const modules = await getModules(path)
    const apps = await getApps(path)

    // console.log('@ ~ handleSetting ~ modules:', modules)
    return {
      code: 200,
      setting: { ...Default, ...setting },
      modules,
      apps,
    }
  } catch (error) {
    console.log('@ ~ handleSetting ~ error:', error)
    return { code: -1 }
  }
}
