import { NodeTread } from './modules/node-tread'
import { GitReview } from './modules/git-review/git-review'
import { QuickStart } from './modules/quick-start'
import { Info } from './modules/info/info'
import RunningApp from './modules/running-app'
import Dash_Project from './modules/project/project'
import ProjectOperation from './modules/project-operation/operation'
import { Dash_Timeline } from './modules/timeline/timeline'
import './style/index.less'

export default function DashboardView() {
  return (
    <div className="root-layout-home-view">
      <div className="root-layout-home-view-container">
        <div className="dashboard-layout-col">
          <Info />
          <QuickStart />
          <RunningApp />
        </div>
        <div className="dashboard-layout-col">
          <Dash_Project />
        </div>
        <div className="dashboard-layout-col">
          <ProjectOperation />
          <NodeTread />
        </div>
        <div className="flex gap col">
          <GitReview />
          <Dash_Timeline />
        </div>
      </div>
    </div>
  )
}
