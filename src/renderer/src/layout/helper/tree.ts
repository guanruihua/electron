import { isArray, isObject } from 'asura-eye'

export const simplifyFileTree = (fileTree: any[]) => {
  const result: any[] = []
  const core = (target: any) => {
    if (isArray(target)) return target.forEach(core)
    if (isObject(target)) {
      const { name, children, isDirectory } = target
      if (!isDirectory) {
        result.push(target)
        return
      }
      if (isArray(children) && children.length === 1) {
        const next = children[0]
        core({
          ...next,
          name: name + ' \\ ' + next.name,
        })
        return
      } else {
        if (isArray(children)) target.children = simplifyFileTree(children)
        result.push(target)
      }
    }
  }
  core(fileTree)
  return result
}
