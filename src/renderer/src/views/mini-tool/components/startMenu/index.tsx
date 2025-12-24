import './index.less'
import { ObjectType } from '0type'
import { AppCard } from '../app-card'
import { classNames } from 'harpe'
import type { UsePageState } from '../../type'
import { isEffectArray } from 'asura-eye'
import { Grid } from 'aurad'
import { FastStart } from './fastStart'
import Pinyin from 'pinyin-match'

export function StartMenu(props: ObjectType & { h: UsePageState }) {
  const { h } = props
  const { state, setState } = h

  const getList = () => {
    if (!isEffectArray(state?.startMenu)) return []
    const result: ObjectType[] = []
    const list = state.startMenu.sort(
      (a, b) =>
        a.fullPath.split('\\').at(-1)[0].charCodeAt() -
        b.fullPath.split('\\').at(-1)[0].charCodeAt(),
    )
    const seen = new Set()
    list.forEach((item) => {
      const name = item.fullPath
      if (item?.fullPath.includes('卸载')) return
      if (item?.fullPath.includes('Uninstall')) return
      if (state.search && !Pinyin.match(state.search, name)) return
      if (seen.has(name)) {
        return
      }
      seen.add(name)
      result.push(item)
    })
    return result
  }

  const renderList: ObjectType[] = getList()

  return (
    <Grid className="page__start-menu">
      <FastStart h={h} />
      <div className="page__start-menu-container">
        {renderList.map((item: ObjectType, i: number) => {
          const { id = i } = item
          return (
            <AppCard
              key={i}
              item={item}
              className={classNames({
                select: state.select?.includes(id),
              })}
              onClick={() => {
                if (!state.select) {
                  state.select = []
                }
                setState({
                  select: state.select.includes(id)
                    ? state.select.filter((_) => _ !== id)
                    : [id, ...state.select],
                })
              }}
            />
          )
        })}
      </div>
    </Grid>
  )
}
