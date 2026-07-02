import { isString } from 'asura-eye'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getWebViewRecord } from './helper'
import { ObjectType } from '0type'
import dayjs from 'dayjs'
import { Conf } from './conf'

export type WebViewState = Partial<{
  activeUID: string
  tmpActiveUID: string
  loadings: Partial<{
    [key: string]: boolean
  }>
  Status: Partial<{
    [key: string]: boolean
  }>
  Logged: Partial<{
    [key: string]: boolean
  }>
  Data: Partial<{
    [key: string]: any
  }>
  [key: string]: any
}>

export type WebViewActions<T> = {
  set(newState: Partial<T>): void
  get(): T
  init(): Promise<void>
  getCache(uid: string): Promise<any>
  analysisURL(uid: string, url: string, flag?: boolean): Promise<void>
  invoke(payload: ObjectType, flag?: boolean): Promise<any>
  setStatus(newStatus: ObjectType): Promise<void>
}

export type UseWebViewState = WebViewState & WebViewActions<WebViewState>

export const useWebViewStore = create(
  persist<UseWebViewState>(
    (set, get) => ({
      activeUID: '',
      tmpActiveUID: '',
      Data: {},
      Status: {},
      loadings: {},
      Logged: {},
      async getCache(uid: string) {
        const find = await window.api.db({
          action: 'find',
          DBName: 'db',
          tableName: 'cache',
          payload: {
            uid: `hot/${uid}`,
          },
        })
        return find.data?.at(0)?.data
      },
      async setStatus(newStatus: ObjectType<boolean>) {
        const { Status } = get()
        set({
          Status: {
            ...Status,
            ...newStatus,
          },
        })
      },
      async init() {
        const { Data = {} } = get()
        for (const item of Conf) {
          const [uid] = item
          const data = await this.getCache(uid)
          if (data) {
            Data[uid] = data
          }
        }
        set({ Data })
      },
      async invoke(payload: ObjectType) {
        return window.api.invoke('webView', payload)
      },
      async analysisURL(uid: string, url: string, flag: boolean = false) {
        const { Data = {}, loadings = {} } = get()
        if (flag) set({ activeUID: uid })

        loadings[uid] = true
        set({ loadings })

        try {
          if (!Data[uid]) {
            const data = await this.getCache(uid)
            if (data) {
              Data[uid] = data
              set({ Data })
            }
          }

          const res = await this.invoke({ url, uid })

          if (res === 1) {
          } else if (res === 2) {
            await this.invoke({ type: 'reload', uid })
          } else {
            return
          }
          const html = await this.invoke({ type: 'get-html', uid })
          // console.log(html)

          if (!isString(html)) return
          const data = getWebViewRecord(uid, html)
          if (!data) return
          data.updateDate = dayjs().format('MM-DD HH:mm:ss')
          Data[uid] = data
          set({ Data })

          await window.api.db({
            action: 'update',
            DBName: 'db',
            tableName: 'cache',
            payload: {
              uid: `proj/${uid}`,
              data,
            },
          })

          return
        } finally {
          loadings[uid] = false
          set({ loadings })
        }
      },
      set,
      get,
    }),
    {
      name: 'webView-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
