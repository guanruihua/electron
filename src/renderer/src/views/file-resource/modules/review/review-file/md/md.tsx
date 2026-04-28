import { useState, useEffect } from 'react'
import { FileNode } from '@/type'
import { isString } from 'asura-eye'
import { Md } from '@/components'
import './md.less'

type Props = {
  file: FileNode
}

export default function ReviewFile_md(props: Props) {
  const { file } = props
  const [value, setValue] = useState('')
  const { path } = file
  const init = async () => {
    // console.log(file)
    const data = await window.api.invoke('fs', {
      action: 'readFile',
      payload: { path },
    })
    console.assert(isString(data), data, file)
    try {
      setValue(data)
    } catch (error) {
      console.log('Format Error', data)
    }
  }

  useEffect(() => {
    init()
  }, [file.path])

  return (
    <div className="frm-review-file-md">
      <div className="frm-review-file-md-render markdown">
        <Md value={value}/>
        {/* {value} */}
      </div>
    </div>
  )
}
