import './style/index.less'
import { Opt } from './modules/opt'
import { Modules } from './modules/modules'
import { NodeTread } from './modules/node-tread'
import { Hook } from '../type'
import { Setting } from './modules/setting'
import { GitReview } from './modules/git-review'

interface HomeViewProps {
  h: Hook
  [key: string]: any
}

export function HomeView(props: HomeViewProps) {
  return (
    <div className="root-layout-home-view h w overflow-y max-h">
      <div
        className="root-layout-home-view-container grid gap p"
        style={{
          gridTemplateColumns: '2fr 3fr 2fr',
        }}
      >
        <div className="flex gap col">
          <Opt {...props} />
          <Setting {...props} />
          <NodeTread {...props} />
        </div>
        <div className="flex gap col">
          <Modules {...props} />
        </div>
        <div className="flex gap col">
          <GitReview {...props} />
        </div>
      </div>
    </div>
  )
}
