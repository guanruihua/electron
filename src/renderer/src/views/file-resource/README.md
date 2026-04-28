打开默认视图（此电脑）
explorer

打开指定目录（例如 D 盘的“照片”文件夹）
explorer D:\照片

打开当前用户的个人文件夹
explorer .
（注意：点号代表当前用户路径，相当于 C:\Users\你的用户名）

打开某个文件夹并选中某个文件
explorer /select, "C:\Users\xxx\文档\报告.docx"
（会打开文件所在文件夹，并高亮该文件）

目标文件夹 命令
桌面 explorer shell:Desktop
下载 explorer shell:Downloads
文档 explorer shell:Personal
此电脑 explorer shell:MyComputerFolder

🗂️ 核心系统与用户文件夹
Shell 命令 打开的目标位置 用途说明
shell:AppData Roaming 应用数据文件夹 存放软件配置、游戏存档等，漫游账户会同步
shell:Local AppData Local 本地应用数据文件夹 存放程序缓存、临时文件，不同电脑不同步
shell:ProgramFiles C:\Program Files 64位软件的默认安装路径
shell:ProgramFilesX86 C:\Program Files (x86) 32位软件的默认安装路径
shell:System C:\Windows\System32 存放系统核心文件
shell:Windows C:\Windows Windows系统主目录
👤 用户个人目录
Shell 命令 打开的目标位置 用途说明
shell:Personal C:\Users\[用户名]\Documents 即“我的文档”文件夹
shell:My Pictures C:\Users\[用户名]\Pictures 即“图片”文件夹
shell:My Music C:\Users\[用户名]\Music 即“音乐”文件夹
shell:My Video C:\Users\[用户名]\Videos 即“视频”文件夹
shell:Recent 最近使用的文件 快速找到近期打开过的文件
shell:SendTo “发送到”菜单文件夹 管理右键菜单“发送到”里的目标位置
shell:Startup 当前用户“启动”文件夹 管理当前用户的开机自启程序
shell:Start Menu 当前用户“开始菜单”文件夹 个性化当前用户的开始菜单布局
🌐 公共与所有用户文件夹
Shell 命令 打开的目标位置 用途说明
shell:Common Desktop 公共桌面 C:\Users\Public\Desktop 放在这里的文件/快捷方式所有用户可见
shell:Common Documents 公共文档 C:\Users\Public\Documents 与所有用户共享的文档
shell:Common Startup 公共“启动”文件夹 所有用户登录时都会启动的程序
shell:Common AppData C:\ProgramData 存放所有用户共享的程序数据
shell:Public C:\Users\Public 公共用户文件夹的根目录
⚙️ 系统功能与设置入口
Shell 命令 打开的目标位置 用途说明
shell:AppsFolder 所有已安装应用视图 即“开始菜单”里的“所有应用”列表
shell:RecycleBinFolder 回收站 无需返回桌面，直接访问回收站
shell:PrintersFolder 打印机和设备 管理已安装的打印机和扫描仪
shell:Fonts 字体文件夹 安装、删除或管理系统字体
shell:Administrative Tools 管理工具 快捷访问“计算机管理”、“事件查看器”等
shell:ControlPanelFolder 控制面板 打开传统控制面板
shell:ConnectionsFolder 网络连接 管理网络适配器（以太网、Wi-Fi）
📌 高级与隐藏文件夹
Shell 命令 打开的目标位置 用途说明
shell:UserProfiles C:\Users 查看电脑上所有用户的文件夹
shell:Cookies Cookies 文件夹 存放浏览器的小型文本数据
shell:History 浏览器历史记录文件夹 主要涉及旧版IE浏览器
shell:NetHood 网络位置快捷方式 管理“网络”里曾访问过的计算机快捷方式
使用方法：按 Win + R 打开“运行”窗口，输入上面的命令（如 shell:Startup），按回车即可直接打开对应的文件夹。
