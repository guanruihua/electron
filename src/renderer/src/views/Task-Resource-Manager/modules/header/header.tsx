import { Button } from 'antd'
import './header.less'
import { UseTRMState } from '@/type'
import { Icon } from '@/components'
import { isArray } from 'asura-eye'

type Props = {
  h: UseTRMState
}

export default function TRMHeader(props: Props) {
  const { TRM, state, loadings, handlePage } = props.h
  return (
    <div className="trm-header">
      <div className="left"></div>
      <div className="right">
        <div className="lastUpdate">{TRM.lastUpdate}</div>
        {['high', 'medium', 'low'].map((status) => (
          <Button
            key={status}
            className="header-status"
            data-status={status}
            data-select={state?.select?.includes(status)}
            onClick={() => {
              if (!isArray(state.select)) state.select = []
              if (state.select.includes(status)) {
                state.select = state.select.filter((_) => _ !== status)
              } else {
                state.select.push(status)
              }
              handlePage.setState({ ...state })
            }}
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
