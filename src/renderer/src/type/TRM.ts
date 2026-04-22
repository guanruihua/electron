import { Loadings, SetLoadings } from '@/util'

export type TRMState = Partial<{
  lastUpdate: string
  list: any[]
}>

export type UseTRMState = {
  state: TRMState
  loadings: Loadings
  handlePage: {
    setLoadings: SetLoadings
    setState(newState: TRMState): void
    init(): Promise<void>
  }
}
