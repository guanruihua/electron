import Dash_Project from '../dashboard/modules/project/project'
import ProjectOperation from '../dashboard/modules/project-operation/operation'
import { GitReview } from '../dashboard/modules/git-review/git-review'

export default function Project() {
  return (
    <div className="layout-grid">
      <Dash_Project />
      <ProjectOperation />
      <GitReview />
    </div>
  )
}
