import { Task, TaskState } from '@/type'
import { isNumber, isString } from 'asura-eye'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Actions<T> = {
  set(newState: Partial<T>): void
  get(): T
  run(task: Task): Promise<void>
  setLoading(task: Task, loading: boolean): void
}
export type UseTaskState = TaskState & Actions<TaskState>

export const useTaskStore = create(
  persist<UseTaskState>(
    (set, get) => ({
      initSuccess: false,
      running: false,
      loadings: {},
      loadingsGroup: {},
      tasks: [],
      taskIndex: 0,
      async setLoading(task: Task, loading: boolean) {
        const { id } = task
        const state = get()
        const newLoadings = state.loadings
        const newLoadingsGroup = state.loadingsGroup
        if (isString(id)) {
          newLoadings[id] = loading
        }
        let group = task.group
        if (!group && id?.includes('/')) {
          group = id.split('/').at(0)
        }
        if (group)
          if (loading) {
            newLoadings[group] = true
            if (isNumber(newLoadingsGroup[group])) {
              ++newLoadingsGroup[group]
            } else {
              newLoadingsGroup[group] = 1
            }
          } else {
            if (isNumber(newLoadingsGroup[group])) {
              --newLoadingsGroup[group]
            } else {
              newLoadingsGroup[group] = 0
            }
            if (newLoadingsGroup[group] < 1) {
              newLoadingsGroup[group] = 0
              newLoadings[group] = false
            }
          }

        set({
          loadings: newLoadings,
          loadingsGroup: newLoadingsGroup,
        })
      },
      async run(task: Task) {
        this.setLoading(task, true)
        try {
          const { exec, cmd } = task
          if (exec) await exec()
          if (isString(cmd)) await window.api.invoke('cmd', cmd)
        } catch (error) {
          console.error(task, error)
        } finally {
          this.setLoading(task, false)
        }
      },
      set,
      get,
    }),
    {
      name: 'task-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
