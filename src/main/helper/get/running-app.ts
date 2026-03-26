import util from 'util'
import { exec } from 'child_process'

const execPromise = util.promisify(exec)

const psCommand = `powershell -command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8; Get-Process | Where-Object { $_.MainWindowTitle -and $_.Path -notlike 'C:\\Windows\\*' -and $_.Company -notlike '*Microsoft*' } | Format-Table ProcessName, Id, MainWindowTitle -AutoSize"`

function parseTable(stdout) {
  const lines = stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((r) => r.trim())
  if (lines.length < 3) return []
  return lines.slice(2).map((r) => {
    const [name, id, title] = r.split(/\s(\d{3,})\s/).map((r) => r.trim())
    return { name, id, title }
  })
}

export async function getRunningApp() {
  try {
    const { stdout, stderr } = await execPromise(psCommand, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024, // 10MB，确保足够
    })
    if (stderr) console.warn('stderr:', stderr)
    console.log(stdout)
    return parseTable(stdout)
  } catch (error) {
    console.error('获取进程列表失败:', error)
    return []
  }
}
