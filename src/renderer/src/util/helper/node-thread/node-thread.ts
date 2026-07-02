import { ObjectType } from '0type'
import { ProjectConf } from '@/type'
import { getOrigin_NodeThread } from './get-origin-NodeThread'
import { processingData_NodeThread } from './processingData_NodeThread'

export const getNodeThread = async (
  projects: ProjectConf[],
  runningUIDMapPID: ObjectType<string[]>,
) => {
  const NodeTreads = await getOrigin_NodeThread()
  const res = processingData_NodeThread(NodeTreads, projects, runningUIDMapPID)
  // console.log(NodeTreads, modules, pids)

  return res
}
