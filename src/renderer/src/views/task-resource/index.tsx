import { DiagonalLoading } from '@/components'
import TRMList from './modules/list/list'
// import TRMTab from './modules/tab/tab'
import { useTRMState } from './state'
import { Dash_Timeline } from '../dashboard/modules/timeline/timeline'
import './index.less'

export default function TaskResourceManager() {
  const h = useTRMState()

  return (
    <div className="trm layout-grid">
      {h?.TRM?.list?.length ? <TRMList h={h} /> : <DiagonalLoading />}
      {/* <TRMTab /> */}
      <div className="trm-card-timeline">
        <Dash_Timeline />
      </div>
    </div>
  )
}
