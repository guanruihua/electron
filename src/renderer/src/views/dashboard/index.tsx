import { NodeTread } from './modules/node-tread'
import { GitReview } from './modules/git-review/git-review'
import { useHomeView } from './hook'
import { QuickStart } from './modules/quick-start'
import { Info } from './modules/info/info'
import RunningApp from './modules/running-app'
import ProjectDashboard from './modules/project/project'
import ProjectOperation from './modules/project-operation/operation'
import './style/index.less'

export default function DashboardView() {
  const h = useHomeView()
  return (
    <div className="root-layout-home-view">
      <div className="root-layout-home-view-container">
        <div className="dashboard-layout-col">
          <Info h={h} />
        </div>
        <div className="dashboard-layout-col">
          <ProjectDashboard h={h} />
        </div>
        <div className="dashboard-layout-col">
          <ProjectOperation h={h} />
          <GitReview />
        </div>
        <div className="flex gap col">
          <QuickStart h={h} />
          <NodeTread h={h} />
          <RunningApp h={h} />
        </div>
      </div>
      {h.context}
    </div>
  )
}
