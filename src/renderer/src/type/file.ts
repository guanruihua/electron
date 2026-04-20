export type FileNode = Partial<{
  // 文件夹/文件名
  name: string
  // 完整路径
  path: string
  parentPath: string
  // 是否为文件夹
  type: 'dir' | 'file'
  fileType: string
  children?: FileNode[]
}>

export type FileTreeType = FileNode[]
