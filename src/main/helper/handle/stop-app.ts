import { isArray, isString } from 'asura-eye'
import { exec } from 'child_process'

// const names = ['NVIDIA Share', 'electron-app', 'QQ']

// 将数组转换为 PowerShell 的 -Name 参数格式： "NVIDIA Share","electron-app","QQ"

export async function stopAppByName(_, target: any) {
  // console.log('stopAppByName: ', target)
  if (!isString(target) && !isArray(target)) return false

  const getNames = () => {
    if (isString(target)) return [target]
    if (isArray(target)) return target
    return []
  }

  const nameParam = getNames()
    .map((name) => `"${name}"`)
    .join(',')

  if (!nameParam) return false

  // 构造完整的 PowerShell 命令
  const cmd = `powershell -command "Stop-Process -Name ${nameParam} -Force"`
  return new Promise((rs) => {
    console.log('stopAppByName / cmd:')
    console.log(cmd)
    exec(cmd, (err, _stdout, stderr) => {
      if (err) {
        console.error('stopAppByName / stop App error:', err.message)
        if (stderr) console.error('Error Info:', stderr)
        return rs(false)
      }
      console.log('stopAppByName / success')
      rs(true)
    })
  })
}
