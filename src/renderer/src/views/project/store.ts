import { isString } from 'asura-eye'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ObjectType } from '0type'
import dayjs from 'dayjs'

export type ProjState = Partial<{
  activeUID: string
  loadings: Partial<{
    [key: string]: boolean
  }>
  Init: Partial<{
    [key: string]: any
  }>
  Data: Partial<{
    [key: string]: any
  }>
  [key: string]: any
}>

export type ProjActions<T> = {
  set(newState: Partial<T>): void
  get(): T
  init(): Promise<void>
  getCache(uid: string): Promise<any>
  analysisURL(uid: string, url: string): Promise<void>
  invoke(payload: ObjectType): Promise<any>
}

export type UseWebViewState = ProjState & ProjActions<ProjState>

export const useProjStore = create(
  persist<UseWebViewState>(
    (set, get) => ({
      activeUID: 'zhihu',
      Init: {},
      Data: {},
      loadings: {},
      async getCache(uid: string) {
        const find = await window.api.db({
          action: 'find',
          DBName: 'db',
          tableName: 'cache',
          payload: {
            uid: `proj/${uid}`,
          },
        })
        return find.data?.at(0)?.data
      },
      async init() {
     
      },
      async invoke(payload: ObjectType) {
        if (isString(payload.uid)) set({ activeUID: payload.uid })
        return window.api.invoke('webView', payload)
      },
      async analysisURL(uid: string, url: string) {
        const { Init = {}, Data = {}, loadings = {} } = get()
        try {
          loadings[uid] = true
          set({ loadings })

          if (!Data[uid]) {
            const data = await this.getCache(uid)
            if (data) {
              Data[uid] = data
              set({ Init, Data, activeUID: uid })
            }
          }

          const res = await this.invoke({ url, uid })
          // console.log(uid, url, res)

          if (res === 1) {
            Init[uid] = true
          } else if (res === 2) {
            Init[uid] = true
            await this.invoke({ type: 'reload', uid })
          } else {
            Init[uid] = false
            set({ Init, activeUID: uid })
            return
          }
          const html = await this.invoke({ type: 'get-html', uid })
          // console.log(html)

          if (!isString(html)) return
          // const data = getWebViewRecord(uid, html)
          const data:any = {}
          if (!data) return
          data.updateDate = dayjs().format('MM-DD HH:mm:ss')
          Data[uid] = data

          set({ Init, Data, activeUID: uid })

          await window.api.db({
            action: 'update',
            DBName: 'db',
            tableName: 'cache',
            payload: {
              uid: `hot/${uid}`,
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
      name: 'project-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
