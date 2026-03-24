import { isObject, isString } from 'asura-eye'
import fs from 'fs/promises'
import path from 'path'

/**
 * 生成目录树结构（支持跳过权限不足的目录）
 * @param {string} dirPath - 要扫描的目录路径
 * @param {Object} options - 配置选项
 * @param {Array<string>} [options.ignoreDirs] - 忽略的目录名（如 ['node_modules', '.git']）
 * @param {boolean} [options.includeFiles=true] - 是否包含文件
 * @param {boolean} [options.includeHidden=false] - 是否包含以点开头的隐藏文件/目录
 * @param {number} [options.maxDepth=Infinity] - 最大递归深度
 * @param {boolean} [options.skipPermissionDenied=true] - 是否跳过无权限的目录（默认跳过）
 * @returns {Promise<Object|null>} 树形对象，无法访问时返回 null
 */
export async function generateTree(dirPath: string, options: any = {}) {
  const {
    ignoreDirs = [],
    includeFiles = true,
    includeHidden = false,
    // maxDepth = Infinity,
    maxDepth = 1,
    skipPermissionDenied = true,
  } = options

  let entries: any
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true })
  } catch (err: any) {
    // 处理权限错误
    if (err.code === 'EPERM' || err.code === 'EACCES') {
      if (skipPermissionDenied) {
        console.warn(`跳过无权限目录: ${dirPath} (${err.code})`)
        return null
      } else {
        throw err // 如果不想跳过，则抛出错误
      }
    }
    // 其他错误（如目录不存在）也返回 null 并打印警告
    console.error(`无法读取目录 ${dirPath}: ${err.message}`)
    return null
  }

  const result: any = {
    name: path.basename(dirPath),
    path: dirPath,
    type: 'directory',
    children: [],
  }

  // 深度限制
  if (maxDepth <= 0) {
    return result
  }

  // 排序：目录在前，文件在后，并各自按名称排序
  const dirs: any[] = []
  const files: any[] = []

  for (const entry of entries) {
    const name = entry.name
    const fullPath = path.join(dirPath, name)

    // 忽略隐藏文件（以 . 开头）
    if (!includeHidden && name.startsWith('.')) continue

    // 忽略指定目录
    if (entry.isDirectory() && ignoreDirs.includes(name)) continue

    if (entry.isDirectory()) {
      dirs.push({ name, fullPath })
    } else if (includeFiles && entry.isFile()) {
      files.push({ name, fullPath })
    }
  }

  // 排序
  dirs.sort((a, b) => a.name.localeCompare(b.name))
  files.sort((a, b) => a.name.localeCompare(b.name))

  // 处理目录（递归）
  for (const dir of dirs) {
    const childTree: any = await generateTree(dir.fullPath, {
      ...options,
      maxDepth: maxDepth - 1,
    })
    if (childTree) {
      result.children.push(childTree)
    }
  }

  // 处理文件
  for (const file of files) {
    result.children.push({
      name: file.name,
      path: file.fullPath,
      type: 'file',
    })
  }

  return result
}

// 在 async 函数中调用
export async function getFileTree(_, conf: any) {
  if (!isObject(conf) || !isString(conf?.path)) return undefined
  const { path, ...rest } = conf
  const tree = await generateTree(path, {
    ignoreDirs: [
      'node_modules',
      '.git',
      'dist',
      '$RECYCLE.BIN',
      'Config.Msi',
      'WindowsApps',
      'System Volume Information',
    ],
    includeHidden: false,
    skipPermissionDenied: true,
    maxDepth: 2,
    ...rest,
  })
  return await fs.writeFile('./t.json', JSON.stringify(tree))
}
