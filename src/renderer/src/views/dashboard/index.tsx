import './style/index.less'
import { NodeTread } from '@/modules/node-tread'
import { DDL } from '@/modules/ddl'
import { ContentLayout } from '@/components/layout'
import { WinInfo } from '@/modules/win-info'

export default function DashboardView() {
  return (
    <ContentLayout name='dashboard' className="page__dashboard">
      <DDL />
      <WinInfo />
      <NodeTread />
    </ContentLayout>
  )
}
