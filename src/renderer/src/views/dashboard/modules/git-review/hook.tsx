import React from 'react'
import { useLoading, useSetState } from '@/util'
import { PageState } from './type'
import { getHty, gitPull, gitPush } from './helper'
import { ProjectConf } from '@/type'
import { useTaskStore } from '@/store/task'

export const usePageState = (selectProject: ProjectConf) => {
  const { label = '', path } = selectProject || {}
  const task = useTaskStore()
  const [pageState, setPageState] = useSetState<PageState>({
    commitMsg: 'feat: Improve the documentation',
    hty: [],
    hty_options: [],
    tree: [],
    simpleTree: [],
  })

  const [fold, setFold] = React.useState<string[]>([])

  const [loading, setLoading] = useLoading(false)

  const query = async () => {
    if(selectProject.git === false) return
    setLoading(true)
    task.add({
      id: 'gitReview__init',
      name: 'Git Review Query State',
      async exec() {
        const hty = (await getHty(path)) || []
        const hty_commits: string[] = []

        if (hty?.length) {
          hty.forEach((item) => {
            const value = item.commit.trim()
            if (hty_commits.includes(value)) return
            hty_commits.push(value)
          })
        }

        setPageState({
          ...(await gitPull(path)),
          hty,
          hty_options: hty_commits.map((value) => ({ value })),
        })
        setLoading(false)
      },
    })
  }

  const handlePush = async () => {
    setLoading(true)
    task.add({
      id: 'gitReview__push',
      name: 'Git Review State Push',
      async exec() {
        const res = await gitPush(path, pageState.commitMsg)
        res ? await query() : setLoading(false)
        return
      },
    })
  }

  React.useEffect(() => {
    path && query()
  }, [path])

  return {
    init: query,
    setLoading,
    loading,
    handlePush,
    label,
    path,
    fold,
    setFold,
    pageState,
    setPageState,
  }
}
