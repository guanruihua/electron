import React from 'react'
import { ModuleProps } from '@/type'
import './log.less'

export default function Log(props: ModuleProps) {
  const {} = props
  const init = () => {
    window.api.on('log', (res) => {
      console.log(res)
    })
  }

  React.useEffect(() => {
    init
  }, [])

  return (
    <div className="dashboard-log">
      <h4>Log</h4>
      <div className="dashboard-log-container"></div>
    </div>
  )
}
