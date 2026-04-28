import { ObjectType } from '0type'
import { Options } from './conf'
import { PageState } from './type'
import { getRenderList } from './helper'

interface Props {
  pageState: PageState
  handleSelf: ObjectType
}

export default function ClipboardType(props: Props) {
  const { pageState, handleSelf } = props
  const { counts, selectType } = pageState

  return (
    <div className="clipboard-manager-type-box">
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
            className="clipboard-manager-type"
          >
            {_.label}
            {_.value !== 'all' && counts?.[_.value] ? (
              <span> · {counts[_.value] > 99 ? '99+' : counts[_.value]}</span>
            ) : (
              <span />
            )}
          </div>
        ))}
    </div>
  )
}
