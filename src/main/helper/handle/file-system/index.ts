import * as add from './add'
import * as del from './del'
import * as save from './save'
import * as query from './query'
import * as check from './check'

const FileSystemMap = {
  ...add,
  ...del,
  ...save,
  ...query,
  ...check,
}

export const fileSystem = async (_, target: any) => {
  const { action, payload } = target
  return FileSystemMap?.[action]?.(payload)
}
