import React from 'react'
import './index.less'
import { Info } from './info/index'
import { Avatar } from './avatar'
import { Search } from './search/index'

export interface MiniToolProps {
  [key: string]: any
}

export function MiniTool(props: MiniToolProps) {
  const {} = props
  return (
    <div className="page__miniTool">
      <div className="page__miniTool-container">
        <Search />
        <Avatar />
        <Info />
      </div>
    </div>
  )
}
