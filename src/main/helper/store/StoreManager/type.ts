export interface StoreInfo {
  name: string
  filename: string
  path: string
  dataType: 'object' | 'array'
}

export interface StorePayload {
  /**
   * @description 数据唯一索引, 删除时候唯一索引
   */
  id?: string
  /**
   * @description 删除多组数据的时候使用
   * @use Del
   */
  ids?: string[]
  [key: string]: any
}
