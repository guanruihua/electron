import './style/index.less'
import { Opt } from './modules/opt'
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

export default function DashboardView() {
  const h = useHomeView()
  return (
    <div
      className="root-layout-home-view h w overflow-y grid gap p"
      style={{
        gridTemplateColumns: '4fr 2fr 4fr 4fr',
        height: 'var(--h)',
      }}
    >
      <div className="flex col gap">
        <Info />
        <QuickStart h={h} />
        <RunningApp h={h} />
        <NodeTread h={h} />
      </div>

      <div className="flex gap col">
        <ProjectDashboard h={h} />
        <Opt h={h} />
      </div>

      <div className="flex gap col">
        <GitReview
          h={h}
          left={<div className="flex gap col"></div>}
          right={<div className="flex gap col"></div>}
        />
        <UserSetting h={h} />
        <SysSetting h={h} />
      </div>
      <div className="flex gap col">
        <ClipboardDashboard h={h} />
      </div>
      {h.context}
    </div>
  )
}
