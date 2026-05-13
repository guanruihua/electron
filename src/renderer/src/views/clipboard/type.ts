import { ObjectType } from "0type"

export interface PageState {
  counts?: {
    all: number
    text: number
    image: number
    file: number
    star: number
  }
  selectType?: string
  list?: ObjectType[]
  renderList?: ObjectType[]
}

export interface DataSchema {
  id: string
  createTime?: number
  updateTime?: number
  [key: string]: any
}