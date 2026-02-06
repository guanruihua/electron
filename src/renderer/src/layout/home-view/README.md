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
