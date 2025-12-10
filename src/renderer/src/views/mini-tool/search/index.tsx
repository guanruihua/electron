import React from 'react'
import { useOwnState } from './state'

export interface Search {
  [key: string]: any
}

export function Search(props: Search) {
  const {} = props
  const { inputRef, uploadRef } = useOwnState()

  return (
    <div className="page__miniTool-container-input">
      <input
        ref={inputRef}
        className="input-text"
        onChange={(e) => {
          const value = e.target.value
          console.log(value)
        }}
      />
      {/* <input ref={uploadRef} className="upload-file" type="file" /> */}
    </div>
  )
}
