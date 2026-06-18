import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Actions<T> = {
  set(newState: Partial<T>): void
  get(): T
}

type LiveBroadcastState = Partial<{
  initSuccess: boolean
  running: boolean
}>

export const useLiveBroadcastStore = create(
  persist<LiveBroadcastState & Actions<LiveBroadcastState>>(
    (set, get) => ({
      initSuccess: false,
      running: false,
      set,
      get,
    }),
    {
      name: 'live-broadcast-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
