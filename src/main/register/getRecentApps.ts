import { ObjectType } from '0type'
import { exec } from 'child_process'
import { promisify } from 'util'
import _fs from 'fs'
import path from 'path'
import os from 'os'

const fs = _fs.promises
const execAsync = promisify(exec)

// 获取最近使用的软件列表
export async function getRecentApps() {
  const recentApps: any[] = []

  try {
    // 方法1: 检查注册表中的 UserAssist
    const regPath =
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist'

    try {
      const { stdout } = await execAsync(`reg query "${regPath}" /s`, {
        encoding: 'utf8',
        windowsHide: true,
      })

      // 解析注册表输出
      const lines = stdout.split('\n')
      for (const line of lines) {
        if (line.includes('{CEBFF5CD-ACE2-4F4F-9178-9926F41749EA}')) {
          // 这是 UserAssist 键，包含程序运行统计
          const matches = line.match(/([A-F0-9]+)\.exe/gi)
          if (matches) {
            matches.forEach((match) => {
              recentApps.push({
                name: match,
                type: 'userassist',
                source: 'registry',
              })
            })
          }
        }
      }
    } catch (regError) {
      console.log('注册表读取失败，尝试其他方法:', regError)
    }

    // 方法2: 检查开始菜单的 Recent Items
    const startMenuPath = path.join(
      os.homedir(),
      'AppData',
      'Roaming',
      'Microsoft',
      'Windows',
      'Recent',
    )

    try {
      const files = await fs.readdir(startMenuPath)
      for (const file of files) {
        if (file.endsWith('.lnk')) {
          const filePath = path.join(startMenuPath, file)
          const stats = await fs.stat(filePath)

          recentApps.push({
            name: file.replace('.lnk', ''),
            path: filePath,
            lastModified: stats.mtime,
            type: 'recent',
            source: 'startmenu',
          })
        }
      }
    } catch (menuError) {
      console.log('开始菜单读取失败:', menuError)
    }

    // 方法3: 检查任务栏固定项目
    const taskbarPath = path.join(
      os.homedir(),
      'AppData',
      'Roaming',
      'Microsoft',
      'Internet Explorer',
      'Quick Launch',
      'User Pinned',
      'TaskBar',
    )

    try {
      if (
        await fs
          .access(taskbarPath)
          .then(() => true)
          .catch(() => false)
      ) {
        const files = await fs.readdir(taskbarPath)
        for (const file of files) {
          if (file.endsWith('.lnk')) {
            const filePath = path.join(taskbarPath, file)
            recentApps.push({
              name: file.replace('.lnk', ''),
              path: filePath,
              type: 'pinned',
              source: 'taskbar',
            })
          }
        }
      }
    } catch (taskbarError) {
      console.log('任务栏读取失败:', taskbarError)
    }

    // 方法4: 通过 WMI 获取进程历史
    try {
      const { stdout } = await execAsync(
        'powershell -Command "Get-WmiObject Win32_Process | Select-Object Name, ProcessId, CreationDate | ConvertTo-Json"',
        { encoding: 'utf8', windowsHide: true },
      )

      if (stdout.trim()) {
        const processes = JSON.parse(stdout)
        processes.forEach((process) => {
          if (process.Name && process.Name.endsWith('.exe')) {
            recentApps.push({
              name: process.Name,
              pid: process.ProcessId,
              created: process.CreationDate,
              type: 'process',
              source: 'wmi',
            })
          }
        })
      }
    } catch (wmiError) {
      console.log('WMI查询失败:', wmiError)
    }
  } catch (error) {
    console.error('获取最近软件列表失败:', error)
  }

  return recentApps
}

// 获取详细程序信息
export async function getProgramDetails(appName) {
  try {
    // 在注册表中查找程序信息
    const { stdout } = await execAsync(
      `powershell -Command "Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*', 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' | Where-Object { $_.DisplayName -like '*${appName}*' } | Select-Object DisplayName, DisplayVersion, Publisher, InstallDate, InstallLocation | ConvertTo-Json"`,
      { encoding: 'utf8', windowsHide: true },
    )

    if (stdout.trim()) {
      return JSON.parse(stdout)
    }
  } catch (error) {
    console.error('获取程序详情失败:', error)
  }

  return null
}



// 获取系统已安装程序
export async function getSystemApps() {
  const apps:any[] = []

  try {
    // 从注册表获取已安装程序
    const regPaths = [
      'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
      'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
      'HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
    ]

    for (const regPath of regPaths) {
      try {
        const { stdout } = await execAsync(`reg query "${regPath}" /s`, {
          encoding: 'utf8',
          windowsHide: true,
        })

        const lines = stdout.split('\n')
        let currentApp: ObjectType = {}

        for (const line of lines) {
          if (line.trim().startsWith('HKEY_')) {
            if (currentApp.DisplayName) {
              apps.push({ ...currentApp })
            }
            currentApp = { registryPath: line.trim() }
          } else if (line.includes('REG_SZ')) {
            const parts = line.trim().split(/\s{4,}/)
            if (parts.length >= 2) {
              const key = parts[0]
              const value = parts.slice(1).join(' ')

              if (key === 'DisplayName') {
                currentApp.DisplayName = value
              } else if (key === 'DisplayVersion') {
                currentApp.Version = value
              } else if (key === 'Publisher') {
                currentApp.Publisher = value
              } else if (key === 'InstallLocation') {
                currentApp.InstallPath = value
              } else if (key === 'UninstallString') {
                currentApp.UninstallPath = value
              }
            }
          }
        }

        if (currentApp.DisplayName) {
          apps.push(currentApp)
        }
      } catch (error) {
        console.log(`读取注册表路径失败 ${regPath}:`, error)
      }
    }
  } catch (error) {
    console.error('获取系统程序失败:', error)
  }

  return apps
}
