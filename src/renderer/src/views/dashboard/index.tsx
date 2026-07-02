import './style/index.less'
import { DDL } from '@/modules/ddl'
import { ContentLayout } from '@/components/layout'
import { WinInfo } from '@/modules/win-info'
import { LiveBroadcast } from '@/modules/live-broadcast'

export default function DashboardView() {
  return (
    <ContentLayout name="dashboard" className="page__dashboard">
      <DDL />
      <WinInfo />
      <LiveBroadcast />
    </ContentLayout>
  )
}
