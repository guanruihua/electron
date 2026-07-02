import { ObjectType } from '0type'
import { SysState, UserInfo } from '@/type'
import { saveSettingToFile } from '@/util'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getSysInitState } from './sys-helper/init'
import { tableName, DBName } from './conf'
import { isString } from 'asura-eye'

type Actions<T> = {
  set(newState: Partial<T>): void
  get(): T
  init(force?: boolean): Promise<void>
  setData(data: ObjectType): Promise<void>
  setUserInfo(info: UserInfo, key?: string): Promise<void>
  saveToFile(type: 'setting' | 'modules'): Promise<void>

}
export type UseSysState = SysState & Actions<SysState>

export const useSysStore = create(
  persist<UseSysState>(
    (set, get) => ({
      initSuccess: false,
      userInfo: {
        uid: 'ruihuag',
      },
      env: {},
      path: '',
      ignoreApps: '',
      selectedQuickStart: 0,
      modules: [],
      data: {},
      innerCol: 1,
      contentLayout: {},

      async setData(data: ObjectType) {
        set({ data: { ...this.data, ...data } })
      },
      async setUserInfo(
        info: UserInfo | UserInfo[keyof UserInfo],
        key?: string,
      ) {
        const userInfo = this.userInfo || { uid: 'ruihuag' }
        const getUserInfo = () => {
          if (isString(key)) {
            return {
              ...userInfo,
              [key]: { ...userInfo[key], ...info },
            }
          }
          return {
            ...userInfo,
            ...info,
          }
        }
        const newUserInfo = getUserInfo()
        set({ userInfo: newUserInfo })

        // update
        const res = await window.api.db({
          action: 'update',
          tableName,
          DBName,
          payload: newUserInfo,
        })
        if (res.error) {
          console.error('UserInfo update error', res.message)
        } else {
          console.log('UserInfo update successfully')
        }
      },
      async init(force: boolean = false) {
        if (force) set({ initSuccess: true })
        set(await getSysInitState())
      },
      async saveToFile(type: 'setting' | 'modules') {
        const {
          path,
          ignoreApps,
          selectedQuickStart = 0,
          selectProject,
        } = get()
        if (!path) return
        if (type === 'setting') {
          saveSettingToFile(path, {
            path,
            ignoreApps,
            selectedQuickStart,
            selectProject,
          })
          return
        }
        return
      },
      set,
      get,
    }),
    {
      name: 'sys-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
