import './style/index.less'
import { Opt } from './modules/opt'
import { Modules } from './modules/modules'
import { NodeTread } from './modules/node-tread'
import { Setting } from './modules/setting'
import { GitReview } from './modules/git-review'
import { useHomeView } from './hook'
import { SelfTerminal } from './modules/terminal'
import { QuickStart } from './modules/quick-start'

export function HomeView() {
  const h = useHomeView()
  return (
    <div
      className="root-layout-home-view h w overflow-y grid gap p"
      style={{
        gridTemplateColumns: '4fr 2fr',
        height: 'var(--h)',
      }}
    >
      <div className="flex gap col">
        <Modules h={h} />
        <div
          className="grid gap"
          style={{
            gridTemplateColumns: '3fr 2fr',
          }}
        >
          <div className="flex gap col">
            <SelfTerminal />
          </div>
          <div className="flex gap col">
            <NodeTread h={h} />
            <Setting h={h} />
          </div>
        </div>
      </div>
      <div className="flex gap col">
        <QuickStart h={h} />
        <GitReview h={h} />
        <Opt h={h} />
      </div>
    </div>
  )
}
