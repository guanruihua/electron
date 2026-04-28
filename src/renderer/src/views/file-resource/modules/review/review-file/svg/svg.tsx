import { useState } from 'react'
import { FileNode } from '@/type'
import { useEffect } from 'react'
import { Button } from 'antd'
// import './json.less'

type Props = {
  file: FileNode
}

export default function ReviewFile_SVG(props: Props) {
  const { file } = props
  const [value, setValue] = useState('')
  const { path } = file
  const init = async () => {
    const data = await window.api.invoke('fs', {
      action: 'readFile',
      payload: { path },
    })
    try {
      const blob = new Blob([data], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      setValue(url)
    } catch (error) {
      console.log('Format Error', data)
    }
  }

  useEffect(() => {
    init()
    return () => {
      try {
        value && URL.revokeObjectURL(value)
      } catch (error) {
        console.error(error)
      }
    }
  }, [file.path])

  // console.log(json)

  return (
    <div className="frm-review-file-svg">
      {/* <Button className="reload" onClick={init}>
        Reload
      </Button> */}
      <div className="frm-review-file-svg-render">
        <img
          src={value}
          style={{
            objectFit: 'contain',
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: 500,
          }}
        />
        {/* {value} */}
      </div>
    </div>
  )
}
