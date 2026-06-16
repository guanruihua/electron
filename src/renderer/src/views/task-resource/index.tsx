import { DiagonalLoading } from '@/components'
import TRMList from './modules/list/list'
// import TRMTab from './modules/tab/tab'
import { useTRMState } from './state'
import { Timeline } from '@/modules/timeline/timeline'
import './index.less'

export default function TaskResourceManager() {
  const h = useTRMState()

  return (
    <div className="trm layout-grid">
      {h?.TRM?.list?.length ? <TRMList h={h} /> : <DiagonalLoading />}
      {/* <TRMTab /> */}
      <div className="trm-card-timeline">
        <Timeline />
      </div>
    </div>
  )
}
