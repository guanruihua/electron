import { ObjectType } from '0type'
import { Options } from './conf'
import { ReactNode } from 'react'
import { PageState } from './type'
import { getRenderList } from './helper'

interface Props {
  pageState: PageState
  handleSelf: ObjectType
  children?: ReactNode
}

export default function ClipboardType(props: Props) {
  const { children, pageState, handleSelf } = props
  const { counts, selectType } = pageState

  return (
    <div className="dashboard-clipboard-type-box">
      <div className="left">
        {Options.Clipboard.map((_) => (
          <div
            key={_.value}
            onClick={(e) => {
              e.preventDefault()
              handleSelf.setPageState({
                selectType: _.value,
                renderList: getRenderList(pageState.list || [], _.value),
              })
            }}
            data-disabled={!counts?.[_.value]}
            data-select={selectType === _.value}
            className="dashboard-clipboard-type"
          >
            {_.label}
            {counts?.[_.value] ? (
              <span> · {counts[_.value] > 99 ? '99+' : counts[_.value]}</span>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>
      <div className="right">{children}</div>
    </div>
  )
}
