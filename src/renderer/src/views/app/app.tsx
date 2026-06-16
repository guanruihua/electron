import { QuickStart } from '@/modules/quick-start'
import RunningApp from '@/modules/running-app'

export default function App() {
  return (
    <div className="layout-grid">
      <RunningApp />
      <QuickStart />
    </div>
  )
}
