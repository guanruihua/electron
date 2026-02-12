```shell
# 1. 查找 Node.js 进程
tasklist | findstr node

# 示例输出：
# node.exe   1234 Console    1    45,532 K
# node.exe   5678 Console    1    52,100 K

# 2. 通过 PID 停止
taskkill /PID 1234 /F
taskkill /PID 5678 /F

# 3. 停止所有 node.exe 进程
taskkill /F /IM node.exe
```

```shell
# netstat -ano | findstr <pid>
netstat -ano | findstr 12556
# TCP    [::1]:3302             [::]:0                 LISTENING       12556
# TCP    [::1]:3302             [::1]:7167             ESTABLISHED     12556

netstat -ano | findstr /i "LISTENING" | findstr 5173
# TCP    0.0.0.0:5173           0.0.0.0:0              LISTENING       30096
# TCP    [::]:5173              [::]:0                 LISTENING       30096
wmic process where processid=30096 get executablepath,commandline /value


# CommandLine=node   "D:\dev\workspace\test\qubit-safe-ui\node_modules\.bin\\..\.store\vite@7.3.1\node_modules\vite\bin\vite.js"
# ExecutablePath=D:\env\nvm\nodejs\node.exe


# 示例：打开 D 盘下的 projects 文件夹
explorer D:\projects

# 示例：打开带空格的目录（需用引号包裹）
explorer "C:\Program Files\nodejs"
```

```js
 const res = await window.api.invoke(
  'cmd',
  `netstat -ano | findstr /i "LISTENING" | findstr ${5173}`,
)
const list = [
  ...new Set(
    res
      .trim()
      .split('\n')
      .map((line: string) =>
        line.trim().replaceAll('\r', '').split(/\s+/).at(-1),
      ),
  ),
]
console.log(list)
```
