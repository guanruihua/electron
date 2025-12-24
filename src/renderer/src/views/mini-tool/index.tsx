import './index.less'
import { Info } from './info/index'
import { Avatar } from './avatar'
import { Search } from './search/index'
import { uesPageState } from './state'

export interface MiniToolProps {
  [key: string]: any
}

export function MiniTool(props: MiniToolProps) {
  const {} = props
  const h = uesPageState()

  return (
    <div className="page__miniTool">
      <div className="page__miniTool-container">
        <Search h={h} />
        <Avatar h={h} />
        <Info h={h} />
      </div>
    </div>
  )
}
