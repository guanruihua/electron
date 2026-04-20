import { useState } from 'react'
import { FileNode } from '../../../helper'
import { useEffect } from 'react'
import { Button } from 'antd'

type Props = {
  file: FileNode
}

export default function ReviewFile_JSON(props: Props) {
  const { file } = props
  const [json, setJSON] = useState({})
  const [jsonStr, setJSONStr] = useState('')
  const { path } = file
  const init = async () => {
    const data = await window.api.invoke('fs', {
      action: 'readFile',
      payload: { path },
    })
    const chunk = data.slice(0, 1000)
    console.log(chunk)
    setJSONStr(chunk)
    try {
      setJSON(JSON.parse(data, (key, value)=>{
        return value.slice(0, 100)
      }))
    } catch (error) {
      console.log('Format Error', data)
    }
  }

  useEffect(() => {
    init()
  }, [file.path])

  console.log(json)

  return (
    <div className="frm-review-file-json">
      <Button className="reload" onClick={init}>
        Reload
      </Button>
      {/* {JSON.stringify(file)} */}
      {/* <pre>{JSON.stringify(json, null, 2)}</pre> */}
      <div className="frm-review-file-json-render">
        {JSON.stringify(json, null, 2)}
        {/* {jsonStr} */}
      </div>
    </div>
  )
}
