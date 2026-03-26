import { isArray, isString } from 'asura-eye'
import { exec } from 'child_process'

// const names = ['NVIDIA Share', 'electron-app', 'QQ']

// 将数组转换为 PowerShell 的 -Name 参数格式： "NVIDIA Share","electron-app","QQ"

export async function stopAppByName(_, target: any) {
  if (isString(target) || !isArray(target)) return false

  const getNames = () => {
    if (isString(target)) return [target]
    if (isArray(target)) return target
    return []
  }

  const nameParam = getNames()
    .map((name) => `"${name}"`)
    .join(',')

  if (!nameParam) return ''

  // 构造完整的 PowerShell 命令
  const cmd = `powershell -command "Stop-Process -Name ${nameParam} -Force"`
  return new Promise((rs) => {
    exec(cmd, (err, _stdout, stderr) => {
      if (err) {
        console.error('关闭进程时出错:', err.message)
        if (stderr) console.error('详细错误:', stderr)
        return rs(false)
      }
      console.log('所有进程已关闭')
      rs(true)
    })
  })
}
