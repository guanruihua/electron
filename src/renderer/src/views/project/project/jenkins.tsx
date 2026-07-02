import { ProjectConf } from '@/type'
import './jenkins.less'

export interface JenkinsProps {
  item: ProjectConf
  [key: string]: any
}

export function JenkinsView(props: JenkinsProps) {
  const { item } = props
  const { Jenkins } = item
  const { frontend_list = [], backend_list = [] } = Jenkins || {}

  return (
    <div
      className="jenkins"
      data-hidden={!(frontend_list?.length && backend_list?.length)}
    >
      <div
        className="frontend"
        data-hidden={!frontend_list?.length}
        data-status={frontend_list.at(0)?.status}
      >
        <div className="title">Frontend</div>
        <div className="container">
          {frontend_list.map((item) => {
            const { status, name, time } = item
            return (
              <div key={name} className="jenkins-item" data-status={status}>
                <div className="status">{status}</div>
                <div className="name">{name}</div>
                <div className="time">{time}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div
        className="backend"
        data-hidden={!backend_list?.length}
        data-status={backend_list.at(0)?.status}
      >
        <div className="title">Backend</div>
        <div className="container">
          {backend_list.map((item) => {
            const { status, name, time } = item
            return (
              <div key={name} className="jenkins-item" data-status={status}>
                <div className="status">{status}</div>
                <div className="name">{name}</div>
                <div className="time">{time}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
