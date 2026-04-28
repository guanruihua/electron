import React from 'react'
import './list.less'
import { UseTRMState } from '@/type'
import { kbToMb } from '../../helper'

type Props = {
  h: UseTRMState
}

export default function TRMList(props: Props) {
  const { TRM, state } = props.h
  const { list = [] } = TRM

  return (
    <div className="trm-list">
      <div className="trm-list-container">
        <div className="header">名称</div>
        <div className="header memory">内存占用</div>
        <div className="header">UIDs</div>

        {list?.map((item, i) => {
          const { name, softwareName, sum, UIDs, status = 'low' } = item
          if (!state.select?.includes(status))
            return <React.Fragment key={i}></React.Fragment>
          return (
            <React.Fragment key={i}>
              <div>{softwareName || name}</div>
              <div className="tr memory" data-status={status}>
                {sum}
              </div>
              <div className="tr uid" title={UIDs}>
                {UIDs}
              </div>
            </React.Fragment>
          )
        })}
        <div className="footer">Total</div>
        <div className="footer memory">{kbToMb(TRM.count.total).toLocaleString()}MB</div>
        <div className="footer">{TRM.count.uid}</div>
      </div>
    </div>
  )
}
