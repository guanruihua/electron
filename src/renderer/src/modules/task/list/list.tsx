import React from 'react'
import './list.less'
import { UseTRMState } from '@/type'
import { kbToMb } from '../helper'
import { Button } from 'antd'
import { Icon } from '@/components'
import { isArray } from 'asura-eye'

type Props = {
  h: UseTRMState
}

export default function TRMList(props: Props) {
  const { TRM, state, loadings, handlePage } = props.h
  const { list = [] } = TRM

  return (
    <div className="trm-list">
      <div className="trm-list-header">
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
        <Button
          loading={loadings.reload || loadings.init}
          icon={<Icon type="reload" style={{ fontSize: 16 }} />}
          className="bolder"
          onClick={() => handlePage.setLoadings(handlePage?.init?.(), 'reload')}
        />
      </div>
      <div className="trm-list-container">
        <div className="header">名称</div>
        <div className="header memory">内存占用</div>
        {list?.map((_, i) => {
          const { name, softwareName, sum, status = 'low' } = _
          if (!state.select?.includes(status))
            return <React.Fragment key={i}></React.Fragment>
          return (
            <React.Fragment key={i}>
              <div>{`${softwareName || name} - ${_.UIDsCount}`}</div>
              <div className="tr memory" data-status={status}>
                {sum}
              </div>
            </React.Fragment>
          )
        })}
        <div className="footer">Total - {TRM.count.uid}</div>
        <div className="footer memory">
          {kbToMb(TRM.count.total).toLocaleString()}MB
        </div>
      </div>
    </div>
  )
}
