import React from 'react'
import './index.less'
import { Opt } from './opt'
import { VSCodeOpt } from './vscode-opt'

export interface HomeViewProps {
  [key: string]: any
}

export function HomeView(props: HomeViewProps) {
  const { handle } = props

  React.useEffect(()=>{
    
  }, [])

  return (
    <div className="root-layout-home-view flex justify-center items-center col gap">
      <span
        className="bold"
        style={{
          fontSize: 24,
        }}
      >
        Home
      </span>
      <Opt handle={handle} />
      <VSCodeOpt />
    </div>
  )
}
