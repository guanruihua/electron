import { clipboard } from 'electron'

let lastText = ''
let lastImageHash = '' // 存储上一次图片的哈希值，用于比较

export function getClipboard() {
  try {
    const formats = clipboard.availableFormats()
    // console.log(formats)
    // 1. 处理图片
    const image = clipboard.readImage()
    // console.log('onClipboard', image)
    // console.log('onClipboard/image', image.isEmpty())
    if (!image.isEmpty()) {
      // 将图片转为 Buffer 或 DataURL 以便比较和传输
      const pngBuffer = image.toPNG() // 获取 PNG Buffer
      // 简单哈希比较（可使用更高效的方法，如计算 Buffer 的哈希值）
      const currentHash = pngBuffer.toString('base64').slice(0, 100) // 仅取前100字符做简单比较，避免全量比较大图
      if (currentHash !== lastImageHash) {
        lastImageHash = currentHash
        // 将图片转为 DataURL，方便渲染进程直接使用
        const dataURL = image.toDataURL()
        return {
          type: 'image',
          formats,
          data: dataURL,
        }
      }
      // 可选：重置图片哈希，但需注意轮询间隔内连续无图片的情况
      // 建议仅在内容变化时处理，这里简单处理
    } else {
      // 2. 处理文本
      const currentText = clipboard.readText()
      if (currentText && currentText !== lastText) {
        lastText = currentText
        return {
          type: 'text',
          formats,
          data: currentText,
        }
      }
    }
    return
  } catch (err) {
    console.error('读取剪贴板失败:', err)
    return 
  }
}

