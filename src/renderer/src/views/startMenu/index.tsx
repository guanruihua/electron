import React from 'react'
import './index.less'
import { ObjectType } from '0type'

export function StartMenu() {
  const [startMenus, setStartMenu] = React.useState<ObjectType[]>([])
  const init = async () => {
    const val: ObjectType[] = await window.api.getStartMenu()
    // console.log('🚀 ~ Home ~ val:', val)
    setStartMenu(val)
  }
  React.useEffect(() => {
    init()
  }, [])

  return (
    <div className="page__start-menu">
      <div className="page__start-menu-container">
        {/* {startMenus.map((path: string) => {
          if (path.includes('卸载')) return <React.Fragment key={path} />
          const name = path
            .split(/\\/)
            .at(-1)
            ?.replace(/\.lnk$/, '')
          return (
            <div key={path} className="start-menu-item" onClick={()=>{
              window.api.openPath(path)
            }}>
              {name}
            </div>
          )
        })} */}
      </div>
    </div>
  )
}
