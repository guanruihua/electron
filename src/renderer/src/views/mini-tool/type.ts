import { ObjectType } from '0type'

export interface PageState {
  search: string
  select: string[]
  fastStart: ObjectType[]
  startMenu: ObjectType[]
  setting: ObjectType
}

export interface Target {
  type: string
  payload?: any
  [key: string]: any
}

export interface UsePageState {
  state: Partial<PageState>
  setState(newState: Partial<PageState>): void
  handle: {
    save(target: Target): void
    [key: string]: any
  }
}
