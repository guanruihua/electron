import * as add from './add'
import * as del from './del'
import * as save from './save'
import * as query from './query'
import * as check from './check'
import * as sort from './sort'
import * as img from './img'
import { isObject, isString } from 'asura-eye'

const FileSystemMap = {
  ...add,
  ...del,
  ...save,
  ...query,
  ...check,
  ...sort,
  ...img,
}

export const fileSystem = async (_, target: any) => {
  const { action, payload = {} } = target
  if (!isObject(payload) || !isString(action)) return

  return FileSystemMap?.[action]?.(payload)
}
