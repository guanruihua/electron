import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Actions<T> = {
  set(newState: Partial<T>): void
  get(): T
  setContentLayout(name: string, cfg: any): void
}

type LayoutState = {
  innerCol: number
  contentLayout: {
    [key: string]: {
      total: number
      show: number[]
    }[]
  }
}

export const useLayoutStore = create(
  persist<LayoutState & Actions<LayoutState>>(
    (set, get) => ({
      innerCol: 1,
      contentLayout: {},
      setContentLayout(name: string, cfg: any) {
        const contentLayout = get().contentLayout
        contentLayout[name] = cfg
        set({ contentLayout })
      },
      set,
      get,
    }),
    {
      name: 'layout-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
