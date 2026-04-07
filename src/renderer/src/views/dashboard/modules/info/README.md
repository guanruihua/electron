| 类别              | 信息项                       | CMD 命令                                     | PowerShell 命令                                                    |
| ----------------- | ---------------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| 🖥️ 系统与内核     | 完整系统信息                 | `systeminfo`                                 | `Get-ComputerInfo`                                                 |
|                   | 操作系统版本                 | `ver`                                        | `Get-ComputerInfo \| Select WindowsProductName, WindowsVersion`    |
|                   | 系统启动时长                 | `systeminfo \| find "System Boot Time"`      | `(Get-CimInstance Win32_OperatingSystem).LastBootUpTime`           |
|                   | 已安装的更新                 | `wmic qfe list brief`                        | `Get-HotFix`                                                       |
| ⚙️ CPU            | 处理器型号/核心数            | `wmic cpu get name, numberofcores`           | `Get-CimInstance Win32_Processor`                                  |
|                   | 逻辑处理器数量               | `echo %NUMBER_OF_PROCESSORS%`                | `(Get-CimInstance Win32_ComputerSystem).NumberOfLogicalProcessors` |
| 💾 内存           | 物理内存总大小               | `wmic memorychip get capacity`               | `Get-CimInstance Win32_PhysicalMemory`                             |
|                   | 内存使用情况                 | –                                            | `Get-Counter "\Memory\Available MBytes"`                           |
| 💿 磁盘与文件系统 | 磁盘列表与分区               | `wmic logicaldisk get name, size, freespace` | `Get-PSDrive -PSProvider FileSystem`                               |
|                   | 物理硬盘信息                 | `wmic diskdrive get model, size`             | `Get-PhysicalDisk`                                                 |
|                   | 磁盘错误检查                 | `chkdsk C: /f /r`                            | `Repair-Volume -DriveLetter C`                                     |
|                   | 检查驱动器健康（S.M.A.R.T.） | –                                            | `Get-PhysicalDisk \| Select-Object *`                              |
| 🌐 网络           | IP地址与MAC地址              | `ipconfig /all`                              | `Get-NetIPAddress`                                                 |
|                   | 网络适配器列表               | –                                            | `Get-NetAdapter`                                                   |
|                   | 网络连接状态                 | `netstat -an`                                | `Get-NetTCPConnection`                                             |
|                   | 网络连通性测试               | `ping <目标IP或域名>`                        | `Test-Connection <目标IP或域名>`                                   |
| 👤 用户与进程     | 当前登录用户                 | `whoami`                                     | `$env:USERNAME`                                                    |
|                   | 系统运行进程                 | `tasklist`                                   | `Get-Process`                                                      |
|                   | 结束指定进程                 | `taskkill /IM <进程名>.exe /F`               | `Stop-Process -Name "<进程名>"`                                    |
| 🛠️ 硬件与固件     | 主板信息                     | `wmic baseboard get product, manufacturer`   | `Get-CimInstance Win32_BaseBoard`                                  |
|                   | BIOS版本                     | `wmic bios get version`                      | `Get-CimInstance Win32_BIOS`                                       |
|                   | 显卡信息                     | `wmic path win32_VideoController get name`   | `Get-CimInstance Win32_VideoController`                            |
|                   | 驱动程序列表                 | `driverquery`                                | `Get-WindowsDriver -Online`                                        |
| 📊 状态与性能     | CPU/内存/磁盘性能            | –                                            | `Get-Counter "\Processor(_Total)\% Processor Time"`                |
|                   | 电池信息（笔记本）           | `powercfg /batteryreport`                    | `Get-CimInstance Win32_Battery`                                    |
