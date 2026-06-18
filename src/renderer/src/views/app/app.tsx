import { ContentLayout } from '@/components/layout'
import { QuickStart } from '@/modules/quick-start'
import RunningApp from '@/modules/running-app'
// import Task from '@/modules/task'
import { Timeline } from '@/modules/timeline/timeline'

export default function App() {
  return (
    <ContentLayout name="app" className="page__app">
      <QuickStart />
      {/* <Task /> */}
      <RunningApp />
      <Timeline />
    </ContentLayout>
  )
}
