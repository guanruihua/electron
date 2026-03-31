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
        gridTemplateColumns: '7fr 5fr',
        height: 'var(--h)',
      }}
    >
      <div className="flex gap col">
        <ProjectDashboard h={h} />
        <div className="grid gap" style={{ gridTemplateColumns: '3fr 2fr' }}>
          <div className="flex col gap">
            <QuickStart h={h} />
            <RunningApp h={h} />
            <Opt h={h} />
          </div>
          <div className="flex col gap">
            <Info />
            <NodeTread h={h} />
            <UserSetting h={h} />
            <SysSetting h={h} />
          </div>
        </div>
      </div>

      <div className="flex gap col">
        <ClipboardDashboard h={h} />
        <GitReview
          h={h}
          left={<div className="flex gap col"></div>}
          right={<div className="flex gap col"></div>}
        />
      </div>
      {h.context}
    </div>
  )
}
