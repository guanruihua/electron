import { Loadings, SetLoadings } from '@/util'

export type TRMState = Partial<{
  status: 'idle' | 'running'
  select: string[]
}>

export type UseTRMState = {
  state: TRMState
  loadings: Loadings
  TRM: {
    count: {
      total: number
      uid: number
    }
    lastUpdate: string
    list: any[]
  }
  handlePage: {
    setLoadings: SetLoadings
    setState(newState: TRMState): void
    init(): Promise<void>
  }
}
