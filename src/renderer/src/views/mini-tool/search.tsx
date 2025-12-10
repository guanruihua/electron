import React from 'react'

export interface Search {
  [key: string]: any
}

export function Search(props: Search) {
  const {} = props
  return (
    <div className="page__miniTool-container-input">
      <input />
    </div>
  )
}
