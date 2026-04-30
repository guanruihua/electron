import { Task, TaskState } from '@/type'
import { isNumber } from 'asura-eye'
import { create } from 'zustand'

type Actions<T> = {
  set(newState: Partial<T>): void
  get(): T
  add(task: Task): Promise<void>
  run(runIndex?: number): Promise<void>
}

export const useTaskStore = create<TaskState & Actions<TaskState>>(
  (set, get) => ({
    initSuccess: false,
    running: false,
    loadings: {},
    loadingsGroup: {},
    tasks: [],
    taskStatus: [],
    taskIndex: 0,
    async run(runIndex?: number) {
      if (!runIndex && runIndex !== 0) runIndex = this.taskIndex ?? 0
      const task = get().tasks[runIndex] || {}
      const { id, exec } = task
      if (!id || !exec || task?.endTime) return

      const state = get()
      const newTasks = state.tasks
      const newLoadings = state.loadings
      task.startTime = Date.now()
      newTasks[runIndex] = task
      task.status = 'running'
      set({
        tasks: newTasks,
      })
      try {
        await exec()
      } catch (error) {
        console.error(error)
        task.status = 'error'
        task.errorMsg = JSON.stringify(error)
      }

      if (id) newLoadings[id] = false

      const newLoadingsGroup = state.loadingsGroup
      let group = task.group
      if (!group && id?.includes('__')) {
        group = id.split('__').at(0)
      }
      if (group) {
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

      task.endTime = Date.now()
      if (task.endTime - task.startTime > 30_000) {
        task.status = 'warning'
      } else {
        task.status = 'success'
      }

      newTasks[runIndex] = task
      set({
        running: false,
        taskIndex: runIndex + 1,
        tasks: newTasks,
        loadings: newLoadings,
        loadingsGroup: newLoadingsGroup,
      })

      await this.run(runIndex + 1)
    },
    async add(task: Task) {
      const { id } = task
      const state = get()
      const newTasks = state.tasks
      const newLoadings = state.loadings
      const newLoadingsGroup = state.loadingsGroup
      if (id) newLoadings[id] = true

      let group = task.group
      if (!group && id?.includes('__')) {
        group = id.split('__').at(0)
      }
      if (group) {
        newLoadings[group] = true
        if (isNumber(newLoadingsGroup[group])) {
          ++newLoadingsGroup[group]
        } else {
          newLoadingsGroup[group] = 1
        }
      }
      newTasks.push(task)

      set({
        tasks: newTasks,
        loadings: newLoadings,
        loadingsGroup: newLoadingsGroup,
      })
      this.run()
    },
    set,
    get,
  }),
)
