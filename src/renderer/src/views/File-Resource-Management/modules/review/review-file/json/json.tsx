import { useState } from 'react'
import { FileNode } from '@/type'
import { useEffect } from 'react'
import { Button } from 'antd'
import { isArray, isNumber, isObject, isString, type } from 'asura-eye'
import './json.less'

type Props = {
  file: FileNode
}
type ReviewRowProps = {
  row: any
  key?: string
}

export default function ReviewFile_JSON(props: Props) {
  const { file } = props
  const [json, setJSON] = useState({})
  const { path } = file
  const init = async () => {
    const data = await window.api.invoke('fs', {
      action: 'readFile',
      payload: { path },
    })
    try {
      const newJson = JSON.parse(data)
      setJSON(newJson)
    } catch (error) {
      console.log('Format Error', data)
    }
  }

  useEffect(() => {
    init()
  }, [file.path])

  function ReviewRow(props_rr: ReviewRowProps) {
    const { key, row } = props_rr
    // console.log('row:', row)
    if (isString(key)) {
      return <div className="render"></div>
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
      const simpleArray = row.every(
        (_) => isString(_) || isString(_) || [undefined, null].includes(_),
      )
      return (
        <div
          className="frm-review-file-json-render-array"
          data-type={simpleArray ? 'simple' : 'default'}
        >
          <div className="prefix">{'['}</div>
          {array.slice(0, 5).map((value, key) => {
            return (
              <div key={key} className="render" data-value-type={type(value)}>
                {/* <div className="key">{key}</div> */}
                <div className="value">
                  <ReviewRow row={value} />
                </div>
              </div>
            )
          })}
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
          <div className="prefix">{'{'}</div>
          {keys.map((key) => {
            const value = row[key]
            return (
              <div key={key} className="render" data-value-type={type(value)}>
                <div className="key">{key}</div>
                <div className="value">
                  <ReviewRow row={value} />
                </div>
              </div>
            )
          })}
          <div className="suffix">{'}'}</div>
        </div>
      )
    }
    return <div className="frm-review-file-json-render-empty">Empty</div>
  }

  // console.log(json)

  return (
    <div className="frm-review-file-json">
      <Button className="reload" onClick={init}>
        Reload
      </Button>
      <div className="frm-review-file-json-render">
        <ReviewRow row={json} />
      </div>
    </div>
  )
}
