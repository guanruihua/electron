import { exec, spawn } from 'child_process'

const dev = (command: string): Promise<any> => {
  return new Promise((rs) => {
    const cmd = spawn(command, {
      shell: true,
    })
    // 实时输出处理
    cmd.stdout.on('data', (data) => {
      rs(cmd.pid)
      console.log('Command PID:', cmd.pid)
      console.log(`Output: ${data}`)
    })

    // cmd.stderr.on('data', (data) => {
    //   console.error(`Error: ${data}`)
    // })

    cmd.on('close', (code) => {
      // if (command !== 'kill %1') {
      //   run_cmd('kill %1')
      // }
      console.log(`Process termination, Exit Code: ${code}`)
      rs(cmd.pid)
    })

    cmd.on('error', (err) => {
      console.error('Running Error:', err)
      rs(-1)
    })
  })
}
const run = (command: string): Promise<any> => {
  return new Promise((rs) => {
    try {
      exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
          console.error('Command / Error:', error)
          rs(-1)
          return
        }
        console.log('Command / Success:', stdout)
        rs(stdout)
        return
      })
      console.log(cmd)
    } catch (error) {
      console.error('Command / Error:', error)
      rs(-1)
      return undefined
    }
  })
}

export const cmd = {
  run,
  dev,
}
