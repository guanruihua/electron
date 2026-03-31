import { ObjectType } from "0type"

export interface PageState {
  counts?: {
    all: number
    text: number
    image: number
    file: number
    star: number
  }
  edit?: boolean
  selectType?: string
  list?: ObjectType[]
  renderList?: ObjectType[]
}