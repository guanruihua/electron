import './style/index.less'
import { NodeTread } from './modules/node-tread'
import { Info } from './modules/info/info'
import { DDL } from './modules/info/ddl'
import { ContentLayout } from '@/components/layout'

export default function DashboardView() {
  return (
    <ContentLayout name='dashboard' className="page__dashboard">
      <DDL />
      <Info />
      <NodeTread />
    </ContentLayout>
  )
}
