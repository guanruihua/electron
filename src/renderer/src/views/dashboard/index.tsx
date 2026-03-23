import './style/index.less'
import { Opt } from './modules/opt'
import { Modules } from './modules/modules'
import { NodeTread } from './modules/node-tread'
import { Setting } from './modules/setting'
import { GitReview } from './modules/git-review/git-review'
import { useHomeView } from './hook'
import { SelfTerminal } from './modules/terminal/terminal'
import { QuickStart } from './modules/quick-start'
import { Info } from './modules/info/info'

export default function DashboardView() {
  const h = useHomeView()
  return (
    <div
      className="root-layout-home-view h w overflow-y grid gap p"
      style={{
        gridTemplateColumns: '1fr 1fr',
        height: 'var(--h)',
      }}
    >
      <div className="flex gap col">
        <Modules h={h} />
        <SelfTerminal />
      </div>

      <div
        className="grid gap"
        style={{
          gridTemplateColumns: '3fr 2fr',
          gridTemplateRows: 'auto 1fr',
        }}
      >
        <div style={{ gridColumn: '1 / -1' }}>
          <GitReview
            h={h}
            left={
              <div className="flex gap col">
                <QuickStart h={h} />
                <NodeTread h={h} />
              </div>
            }
            right={
              <div className="flex gap col">
                <Info h={h} />
                <Opt h={h} />
                <Setting h={h} />
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}
