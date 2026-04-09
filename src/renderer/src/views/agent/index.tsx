import { Button } from 'antd'
import './index.less'

export default function Agent() {
  return (
    <div className="agent">
      agent
      {/* <img src="local-img://D:/Pictures/logo.png" /> */}
      <Button onClick={() => window.api.invoke('toggleDevTools')}>
        Devtool
      </Button>
    </div>
  )
}
