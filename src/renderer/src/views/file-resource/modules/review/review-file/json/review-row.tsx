import { useState } from 'react'
import { isArray, isNumber, isObject, isString } from 'asura-eye'
import { getGap, getStatus } from './helper'

type ReviewRowProps = {
  row: any
  rowKey?: string | number
  depth?: number
}

function ReviewRowRender(props: ReviewRowProps) {
  const { rowKey, row, depth = 0 } = props

  const nextDepth = depth + 1
  const [fold, setFold] = useState(false)

  const [gapStart, gapEnd] = getGap(row)
  const status = getStatus(row)

  const onClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setFold((v) => !v)
  }

  // if (status.simpleObject) {
  //   return (
  //     <div className="render">
  //       <div className="key" onClick={onClick} data-simple-array="1">
  //         <span className="key-label">{rowKey}</span>
  //         <span className="gap">{': ' + gapStart}</span>
  //         {!fold && <ReviewRow row={row} depth={nextDepth} />}
  //         {fold && <span className="end">{' ... ' + gapEnd}</span>}
  //       </div>
  //     </div>
  //   )
  // }

  if (status.simpleArray) {
    return (
      <div className="render">
        <div className="key" onClick={onClick} data-simple-array="1">
          <span className="key-label">{rowKey}</span>
          <span className="gap">{': ' + gapStart}</span>
          {!fold && <ReviewRow row={row} depth={nextDepth} />}
          {fold && <span className="end">{' ... ' + gapEnd}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="render">
      <div className="key" onClick={onClick}>
        <span className="key-label">{rowKey}</span>
        <span className="gap">{': ' + gapStart}</span>
        {fold && <span className="end">{' ... ' + gapEnd}</span>}
      </div>
      {!fold && <ReviewRow row={row} depth={nextDepth} />}
    </div>
  )
}

export default function ReviewRow(props: ReviewRowProps) {
  const { rowKey, row, depth = 0 } = props
  // console.log('row:', row)
  const nextDepth = depth + 1
  const [showNum, setShowNum] = useState(10)
  if (isString(rowKey) || isNumber(rowKey)) {
    return <ReviewRowRender {...props} />
  }
  if (isString(row)) {
    return <div className="frm-review-file-json-render-str">"{row}"</div>
  }
  if (isNumber(row)) {
    return <div className="frm-review-file-json-render-num">{row}</div>
  }
  if (isArray(row)) {
    const array = row
    if (array.length == 0) {
      return <div className="frm-review-file-json-render-array">{'[]'}</div>
    }
    return (
      <div className="frm-review-file-json-render-array">
        {depth === 0 && <div>{'['}</div>}
        {array.slice(0, showNum).map((value, key) => (
          <ReviewRow key={key} rowKey={key} row={value} depth={nextDepth} />
        ))}
        {array.length > showNum && (
          <div
            className="show-rest"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setShowNum((n) => n + 10)
            }}
          >
            ...
          </div>
        )}
        <div className="suffix">{']'}</div>
      </div>
    )
  }
  if (isObject(row)) {
    const keys = Object.keys(row)
    if (keys.length == 0) {
      return <div className="frm-review-file-json-render-object">{'{}'}</div>
    }
    return (
      <div className="frm-review-file-json-render-object">
        {depth === 0 && <div>{'{'}</div>}
        {keys.slice(0, showNum).map((key) => (
          <ReviewRow key={key} rowKey={key} row={row[key]} depth={nextDepth} />
        ))}
        {keys.length > showNum && (
          <div
            className="show-rest"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setShowNum((n) => n + 5)
            }}
          >
            ...
          </div>
        )}
        <div className="suffix">{'}'}</div>
      </div>
    )
  }
  return <div className="frm-review-file-json-render-empty">Empty</div>
}
