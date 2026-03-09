import './style/index.less'
import { Opt } from './modules/opt'
import { Modules } from './modules/modules'
import { NodeTread } from './modules/node-tread'
import { Setting } from './modules/setting'
import { GitReview } from './modules/git-review'
import { useHomeView } from './hook'

export function HomeView() {
  const h = useHomeView()
  return (
    <div className="root-layout-home-view h w overflow-y max-h">
      <div
        className="root-layout-home-view-container grid gap p"
        style={{
          gridTemplateColumns: '2fr 3fr 2fr',
        }}
      >
        <div className="flex gap col">
          <Opt h={h} />
          <Setting h={h} />
          <NodeTread h={h} />
        </div>
        <div className="flex gap col">
          <Modules h={h} />
        </div>
        <div className="flex gap col">
          <GitReview h={h} />
        </div>
      </div>
    </div>
  )
}
