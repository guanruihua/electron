import { QuickStart } from '../dashboard/modules/quick-start'
import RunningApp from '../dashboard/modules/running-app'

export default function App() {
  return (
    <div className="layout-grid">
      <RunningApp />
      <QuickStart />
    </div>
  )
}
