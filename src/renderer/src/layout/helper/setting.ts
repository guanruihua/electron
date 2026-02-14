import { ObjectType } from '0type'
import { State } from '../type'
import { getJSON } from './get'

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

    const setting = getJSON(await window.api.invoke('fs', {
      action: 'readFile',
      payload: { path: path + '/setting.json' },
    }), {
      path,
    }) as State['setting']

    if (setting && setting.path) {
      setting.path = path
    }
    // console.log('@ ~ handleSetting ~ setting:', setting)

    const modules = getJSON(
      await window.api.invoke('fs', {
        action: 'readFile',
        payload: { path: path + '/modules.json' },
      }),
      [],
    )

    // console.log('@ ~ handleSetting ~ modules:', modules)
    return { code: 200, setting, modules }
  } catch (error) {
    console.log('@ ~ handleSetting ~ error:', error)
    return { code: -1 }
  }
}
