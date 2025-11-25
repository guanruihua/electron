// server/app.js
import express from 'express'
import cors from 'cors' // 示例中间件

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/data', (req: any, res: any) => {
  console.log(req)
  res.json({ message: 'Data from separated Express API!' })
})

// 导出启动和停止服务器的方法
export function startServer(port = 3000) {
  return new Promise((resolve, reject) => {
    const server = app
      .listen(port, () => {
        console.log(`Express server running on port ${port}`)
        resolve(server)
      })
      .on('error', reject)
  })
}

export function stopServer(server: any) {
  return new Promise((resolve) => {
    server.close(() => {
      console.log('Express server stopped.')
      resolve(null)
    })
  })
}

