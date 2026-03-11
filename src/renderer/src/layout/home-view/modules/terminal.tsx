import { useRef, useEffect } from 'react'
import { Terminal } from '@xterm/xterm'
import { Button } from 'antd'
import '@xterm/xterm/css/xterm.css'
// import { FitAddon } from 'xterm-addon-fit'
// import { ClipboardAddon } from '@xterm/addon-clipboard'
import { copy } from '@/util'

export function SelfTerminal() {
  const commandInputRef = useRef<string>('')
  // const fitAddonRef = useRef<FitAddon>(new FitAddon())
  // const clipboardAddonRef = useRef<ClipboardAddon>(new ClipboardAddon())
  const terminalInstanceRef = useRef<Terminal | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const handleCommand = (terminal: Terminal, command: string) => {
    console.log({ terminal, command })
    switch (command) {
      case 'clear':
        terminal.clear()
        terminal.reset()
        terminal.scrollToTop()
        commandInputRef.current = ''
        terminal.write('$ ')
        break

      default:
        terminal.write(`\r\n未知命令: ${command}\r\n$ `)
        commandInputRef.current = ''
        terminal.write('$ ')
        break
    }
  }

  const getTerminal = () => {
    if (!terminalRef.current) return
    if (terminalInstanceRef.current) return terminalInstanceRef.current

    const terminal = new Terminal({
      lineHeight: 1.4,
      fontSize: 14,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      convertEol: true,
      theme: {
        foreground: '#e0e0e0',
        background: '#000',
        cursor: '#e0e0e0',
      },
    })
    terminal.open(terminalRef.current)
    // terminal.loadAddon(clipboardAddonRef.current)
    // terminal.loadAddon(fitAddonRef.current)

    // setTimeout(() => {
    //   if (terminalInstanceRef.current) {
    //     try {
    //       fitAddonRef.current.fit()
    //     } catch (error) {
    //       console.warn('FitAddon 适配失败，已降级处理:', error)
    //       // 降级方案：手动设置终端尺寸(待开发...)
    //     }
    //   }
    // }, 0)

    terminalInstanceRef.current = terminal
    return terminal
  }

  const handleOnKey = (terminal: Terminal, { key, domEvent }) => {
    // console.log(' handleOnKey: ', { key, domEvent })
    const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey
    if(domEvent.code === 'KeyC' && domEvent.ctrlKey){
      const selection = terminal.getSelection()
      console.log('复制', selection)
      copy(selection)
      return
    }
    // 处理回车（执行命令）
    if (key === '\r') {
      // 1. 清空换行，避免重复输出
      terminal.write('\r\n')

      // 2. 获取并处理命令（使用存储的命令，而非从buffer读取）
      const command = commandInputRef.current.trim()
      if (command) {
        handleCommand(terminal, command)
      }

      // 3. 重置命令存储，重新显示提示符
      commandInputRef.current = ''
      terminal.write('$ ')
    }
    // 处理退格
    else if (key === '\x7F') {
      if (commandInputRef.current.length > 0) {
        // 移除最后一个字符
        commandInputRef.current = commandInputRef.current.slice(0, -1)
        // 终端显示退格效果
        terminal.write('\b \b')
      }
    }
    // 处理可打印字符输入
    else if (printable) {
      // 存储输入的字符
      commandInputRef.current += key
      // 终端显示输入的字符
      terminal.write(key)
    }
  }

  const load = () => {
    const terminal = getTerminal()
    if (!terminal) return
    handleCommand(terminal, 'clear')

    const e = terminal.onKey((e) => handleOnKey(terminal, e))
    // 监听窗口大小变化，重新适配终端尺寸
    // const resizeHandler = () => {
    //   if (fitAddonRef.current && terminal) {
    //     fitAddonRef.current.fit()
    //   }
    // }
    // window.addEventListener('resize', resizeHandler)

    // 组件卸载时清理资源
    return () => {
      // 卸载 onKey 监听
      if (e) {
        e?.dispose?.()
      }
      // 销毁终端实例
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.dispose()
        terminalInstanceRef.current = null
      }
      // window.removeEventListener('resize', resizeHandler)
    }
  }
  useEffect(load, [])
  const clear = () => {
    terminalInstanceRef.current &&
      handleCommand(terminalInstanceRef.current, 'clear')
  }
  const test = () => {
    const term = terminalInstanceRef.current
    if (!term) return
    term.write('\r\n')
    term.write('\x1B[91m') // 切换到 brightRed 颜色
    term.write('错误：这是高亮的错误文本\r\n')
    term.write('\x1B[0m') // 恢复默认颜色
    term.write('普通文本\r\n')
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m \n')
    // 模拟输出内容
    term.write('error: 连接失败\r\n')
    term.write('info: 启动成功\r\n')
    term.write('warning: 内存不足\r\n')
    term.write('error: 权限不足\r\n')

    // 1. 16 色示例
    term.write('\x1B[1;31m加粗红色\x1B[0m ') // 加粗+前景红
    term.write('\x1B[42;30m绿色背景黑色文字\x1B[0m\r\n') // 背景绿+前景黑

    // 2. 256 色示例
    term.write('\x1B[38;5;123m256色-紫色\x1B[0m ')
    term.write('\x1B[48;5;220m256色-黄色背景\x1B[0m\r\n')

    // 3. True Color（RGB）示例
    term.write('\x1B[38;2;100;200;50mRGB-青绿色\x1B[0m ')
    term.write('\x1B[48;2;200;100;150mRGB-粉色背景\x1B[0m\r\n')

    // 4. 组合样式
    term.write('\x1B[1;4;33m加粗+下划线+黄色文本\x1B[0m\r\n')
    commandInputRef.current = ''
    term.write('$ ')
  }
  return (
    <div className="root-layout-home-view-terminal">
      <div className="root-layout-home-view-git-review">
        <div className="module-bg w flex gap col">
          <div
            className="flex space-between items-center"
            style={{ paddingBottom: 20 }}
          >
            <div className="flex row gap bold">Terminal</div>
            <div className="flex gap">
              <Button onClick={test}>test</Button>
              <Button onClick={clear}>Clear</Button>
            </div>
          </div>
          <div
            ref={terminalRef}
            className="overflow-y bg border-radius p"
            style={{ minHeight: 300, maxHeight: 900 }}
          ></div>
        </div>
      </div>
    </div>
  )
}
