import { Task, TaskState } from '@/type'
// import { getUUID } from '@/util'
import { isArray, isNumber, isObject, isString } from 'asura-eye'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Actions<T> = {
  set(newState: Partial<T>): void
  get(): T
  check(oldIndex?: number): void
  run(task: Task): Promise<void>
  runIndex(runIndex?: number): Promise<void>
  setLoading(task: Task, loading: boolean): void
}

export const useTaskStore = create(
  persist<TaskState & Actions<TaskState>>(
    (set, get) => ({
      initSuccess: false,
      running: false,
      loadings: {},
      loadingsGroup: {},
      tasks: [],
      taskIndex: 0,
      check(oldIndex = -1) {
        const findIndex = get().tasks.findIndex((_) => !_.endTime)
        if (findIndex === oldIndex || findIndex === -1) return
        this.runIndex(findIndex)
      },
      async runIndex(runIndex?: number) {
        const state = get()
        if (state.running) return
        if (!runIndex && runIndex !== 0) runIndex = this.taskIndex ?? 0
        const task = state.tasks[runIndex]
        if (!isObject<Task>(task)) return this.check(runIndex)
        if (!task?.exec || !task?.id || task?.endTime)
          return this.check(runIndex)

        const newTasks = get().tasks
        task.startTime = Date.now()
        task.status = 'running'
        newTasks[runIndex] = task
        set({
          running: true,
          tasks: newTasks,
        })

        try {
          // let runTime = Date.now()
          const execMsg = await task.exec()
          // console.log(execMsg)

          if (execMsg)
            if (isString(execMsg)) task.execMsg = execMsg
            else if (isArray(execMsg))
              task.execMsg = execMsg.map((v) => JSON.stringify(v)).join('\n')
        } catch (error) {
          console.error(error)
          task.status = 'error'
          task.errorMsg = JSON.stringify(error)
        } finally {
          this.setLoading(task, false)
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
          tasks: newTasks,
          taskIndex: runIndex + 1,
        })

        await this.runIndex(runIndex + 1)
      },
      async setLoading(task: Task, loading: boolean) {
        const { id } = task
        const state = get()
        const newLoadings = state.loadings
        const newLoadingsGroup = state.loadingsGroup

        let group = task.group
        if (!group && id?.includes('__')) {
          group = id.split('__').at(0)
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
        // const uuid = getUUID()
        // console.log(uuid)
        const state = get()
        const newTasks = state.tasks
        newTasks.push(task)
        set({
          tasks: newTasks,
        })
        this.setLoading(task, true)
        this.runIndex()
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
