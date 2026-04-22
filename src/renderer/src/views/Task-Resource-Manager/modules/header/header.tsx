import { Button } from 'antd'
import './header.less'
import { UseTRMState } from '@/type'
import { Icon } from '@/components'

type Props = {
  h: UseTRMState
}

export default function TRMHeader(props: Props) {
  const { state, loadings, handlePage } = props.h
  return (
    <div className="trm-header">
      <div className="left"></div>
      <div className="right">
        <div className="lastUpdate">{state.lastUpdate}</div>
        {['high', 'medium', 'low'].map((status) => (
          <Button
            className="header-status"
            data-status={status}
            onClick={() => window.api.invoke('toggleDevTools')}
          >
            {status}
          </Button>
        ))}
        <Button onClick={() => window.api.invoke('toggleDevTools')}>
          Devtool
        </Button>
        <Button
          loading={loadings.reload || loadings.init}
          icon={<Icon type="reload" style={{ fontSize: 16 }} />}
          className="bolder"
          onClick={() => handlePage.setLoadings(handlePage?.init?.(), 'reload')}
        />
      </div>
    </div>
  )
}
