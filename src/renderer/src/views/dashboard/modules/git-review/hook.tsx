import React from 'react'
import { Hook } from '@/type'
import { useLoading, useSetState } from '@/util'
import { PageState } from './type'
import { getHty, gitPull, gitPush } from './helper'

export const usePageState = (h: Hook) => {
  const { state } = h
  const { label = '', path } = state?.setting?.selectGitModule || {}

  const [pageState, setPageState] = useSetState<PageState>({
    commitMsg: 'feat: Improve the documentation',
    hty: [],
    tree: [],
    simpleTree: [],
  })

  const [fold, setFold] = React.useState<string[]>([])

  const [loading, setLoading] = useLoading(false)

  const init = async () => {
    setLoading(true)
    setPageState({
      ...(await gitPull(path)),
      hty: await getHty(path),
    })
    setLoading(false)
  }

  const handlePush = async () => {
    setLoading(true)
    ;(await gitPush(path, pageState.commitMsg)) ? init() : setLoading(false)
  }

  React.useEffect(() => {
    path && init()
  }, [path])

  return {
    init,
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
