import { ObjectType } from '0type'
import { SysState } from '@/type'
import { getOrigin_NodeThread } from './get-origin-NodeThread'
import { processingData_NodeThread } from './processingData_NodeThread'

export const getNodeThread = async (
  modules: SysState['modules'],
  runningUIDMapPID: ObjectType<string[]>,
) => {
  const NodeTreads = await getOrigin_NodeThread()
  const res = processingData_NodeThread(NodeTreads, modules, runningUIDMapPID)
  // console.log(NodeTreads, modules, pids)

  return {
    NodeTreads: res.NodeTreads || [],
    Modules: res.Modules || [],
  }
}
