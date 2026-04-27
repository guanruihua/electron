import React from "react"

export interface ClipboardManagerProps {
  [key: string]: any
}

export function ClipboardManager(props: ClipboardManagerProps){
  const {} = props
  return (
    <div>
      ClipboardManager
      {JSON.stringify(Object.keys(props))}
    </div>
  )
}
