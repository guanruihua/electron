import { NodeTread } from './modules/node-tread'
import { GitReview } from './modules/git-review/git-review'
import { useHomeView } from './hook'
import { QuickStart } from './modules/quick-start'
import { Info } from './modules/info/info'
import RunningApp from './modules/running-app'
import ProjectDashboard from './modules/project/project'
import ProjectOperation from './modules/project/operation'
import './style/index.less'
// import { UserSetting } from './modules/user-setting'
// import { SysSetting } from './modules/sys-setting'
// import Log from './modules/log/log'

export default function DashboardView() {
  const h = useHomeView()
  return (
    <div className="root-layout-home-view">
      <div className="root-layout-home-view-container">
        <div className="dashboard-layout-col">
          <Info h={h} />
          <QuickStart h={h} />
        </div>
        <div className="dashboard-layout-col">
          <ProjectDashboard h={h} />
          {/* <UserSetting h={h} /> */}
          {/* <SysSetting h={h} /> */}
        </div>
        <div className="dashboard-layout-col">
          <ProjectOperation h={h} />
          <GitReview />
          <NodeTread h={h} />
          {/* <Log h={h} /> */}
        </div>

        <div className="flex gap col">
          <RunningApp h={h} />
        </div>
      </div>
      {h.context}
    </div>
  )
}
