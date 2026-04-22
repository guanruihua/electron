import './index.less'
import TRMHeader from './modules/header/header'
import TRMList from './modules/list/list'
import TRMTab from './modules/tab/tab'
import { useTRMState } from './state'

export default function TaskResourceManager() {
  const h = useTRMState()

  return (
    <div className="trm">
      <TRMHeader h={h} />
      <div className="container">
        <TRMList h={h} />
        {/* <TRMTab /> */}
      </div>
    </div>
  )
}
