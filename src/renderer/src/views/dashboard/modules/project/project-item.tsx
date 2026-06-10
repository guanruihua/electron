import { ProjectConf } from '@/type'
import { useSysStore } from '@/store/sys'

export const ProjectItem = (props: { item: ProjectConf }) => {
  const sys = useSysStore()
  const { item } = props
  const name = item.label || item.path

  return (
    <div>
      <div
        className="opt-item flex"
        data-path={item?.path?.replaceAll('\\', '>')}
        data-start={item.running ? 1 : 0}
        data-pid
        title={item.label || item.path}
        data-select={sys?.selectProject?.path === item?.path}
      >
        <span
          className="opt-item-name bold pointer"
          onClick={() => sys.handleSelectProject(item)}
        >
          {name}
        </span>
      </div>
    </div>
  )
}
