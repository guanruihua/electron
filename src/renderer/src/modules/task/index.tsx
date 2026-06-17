import { DiagonalLoading } from '@/components'
import TRMList from './list/list'
import { useTRMState } from './state'
import './index.less'

export default function Task() {
  const h = useTRMState()

  return (
    <div className="trm">
      {h?.TRM?.list?.length ? <TRMList h={h} /> : <DiagonalLoading />}
    </div>
  )
}
