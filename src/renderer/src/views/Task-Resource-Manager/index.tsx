import { DiagonalLoading } from '@/components'
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
        {h?.TRM?.list?.length ? <TRMList h={h} /> : <DiagonalLoading />}
        {/* <TRMTab /> */}
      </div>
    </div>
  )
}
