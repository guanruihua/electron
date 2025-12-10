import React from 'react'
import './index.less'
import { ObjectType } from '0type'
import { AppCard } from '../mini-tool/components'

export function StartMenu() {
  const [startMenus, setStartMenu] = React.useState<ObjectType[]>([])
  const init = async () => {
    const val: ObjectType[] = await window.api.getStartMenu()
    // console.log('🚀 ~ Home ~ val:', val)
    setStartMenu(val)
  }
  React.useEffect(() => {
    setTimeout(() => {
      init()
    }, 1000)
  }, [])

  return (
    <div className="page__start-menu">
      <h4>最近使用</h4>
      <div className="page__start-menu-container">
        {startMenus.map((item: ObjectType, i: number) => {
          if (item?.fullPath.includes('卸载')) return <React.Fragment key={i} />
          return <AppCard key={i} item={item} />
        })}
      </div>
    </div>
  )
}
