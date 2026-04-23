import { NodeTread } from './modules/node-tread'
import { SysSetting } from './modules/sys-setting'
import { GitReview } from './modules/git-review/git-review'
import { useHomeView } from './hook'
import { QuickStart } from './modules/quick-start'
import { Info } from './modules/info/info'
import RunningApp from './modules/running-app'
import { UserSetting } from './modules/user-setting'
import ClipboardDashboard from './modules/clipboard/clipboard'
import ProjectDashboard from './modules/project/project'
import ProjectOperation from './modules/project/operation'
import './style/index.less'
// import Log from './modules/log/log'

export default function DashboardView() {
  const h = useHomeView()
  return (
    <div className="root-layout-home-view">
      <div className="root-layout-home-view-container">
        <div className="dashboard-layout-col">
          <Info h={h} />
          <QuickStart h={h} />
          <RunningApp h={h} />
        </div>
        <div className="dashboard-layout-col">
          <ProjectDashboard h={h} />
        </div>
        <div className="dashboard-layout-col">
          <ProjectOperation h={h} />
          <GitReview h={h} />
          <NodeTread h={h} />
          {/* <Log h={h} /> */}
          <UserSetting h={h} />
          <SysSetting h={h} />
        </div>

        <div className="flex gap col">
          <ClipboardDashboard h={h} />
        </div>
      </div>
      {h.context}
    </div>
  )
}
