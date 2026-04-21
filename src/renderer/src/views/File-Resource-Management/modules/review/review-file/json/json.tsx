import { useState } from 'react'
import { FileNode } from '@/type'
import { useEffect } from 'react'
import { Button } from 'antd'
import './json.less'
import ReviewRow from './review-row'

type Props = {
  file: FileNode
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

  // console.log(json)

  return (
    <div className="frm-review-file-json">
      {/* <Button className="reload" onClick={init}>
        Reload
      </Button> */}
      <div className="frm-review-file-json-render">
        <ReviewRow row={json} />
      </div>
    </div>
  )
}
