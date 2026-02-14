import React from 'react'

export interface IconProps extends React.HTMLAttributes<SVGSVGElement> {
  type:
    | 'stop'
    | 'run'
    | 'open'
    | 'web'
    | 'google'
    | 'vscode'
    | 'dir'
    | 'badge-success'
    | 'badge-warning'
    | 'badge-error'
  [key: string]: any
}

export function Icon(props: IconProps) {
  const { type, ...rest } = props
 
  return <div></div>
}
