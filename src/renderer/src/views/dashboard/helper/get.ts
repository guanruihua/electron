import { isString } from 'asura-eye'
import { FileTreeType } from '../type'

export const getJSON = (value: any, defaultValue = {}) => {
  try {
    if (isString(value)) {
      return JSON.parse(value) || defaultValue
    }
  } catch {
    return defaultValue
  }
  return defaultValue
}

/**
 * 解析 Git 状态文本，生成带状态的文件树
 * @param gitStatusText Git 状态文本（如你提供的多行内容）
 * @returns 嵌套的文件树数组
 */
export function getFileTree(gitStatusText: string) {
  // ------------------------------
  // 步骤1：定义类型（JS 可忽略，仅为清晰）
  // ------------------------------
  /** 单个文件状态项 */
  class StatusItem {
    constructor(statusCode, statusDesc, path, isDirectory) {
      this.statusCode = statusCode; // 原始状态码：M/D/??
      this.statusDesc = statusDesc; // 中文描述：修改/删除/新增
      this.path = path;             // 标准化路径（去除末尾/）
      this.isDirectory = isDirectory; // 是否为文件夹
    }
  }

  // ------------------------------
  // 步骤2：解析 Git 状态文本为状态项数组
  // ------------------------------
  // 状态码映射表
  const statusMap = new Map([
    ['M', '修改'],
    ['D', '删除'],
    ['??', '新增（未跟踪）']
  ]);

  // 拆分文本为行，过滤空行
  const lines = gitStatusText.split('\n').map(line => line.trim()).filter(line => line);
  const statusItems = [];

  lines.forEach(line => {
    // 提取状态码（前两位，处理 ??/ M/ D 等情况）
    let statusCode = line.substring(0, 2).trim();
    // 提取路径（去掉状态码后的部分）
    let rawPath = line.substring(2).trim();
    
    // 处理文件夹路径（末尾带/）
    const isDirectory = rawPath.endsWith('/');
    // 标准化路径：去除末尾/，避免路径不一致
    const normalizedPath = isDirectory ? rawPath.slice(0, -1) : rawPath;

    // 补充状态描述
    const statusDesc = statusMap.get(statusCode) || '未知';
    statusItems.push(new StatusItem(statusCode, statusDesc, normalizedPath, isDirectory));
  });

  // ------------------------------
  // 步骤3：构建文件树核心逻辑
  // ------------------------------
  // 虚拟根节点（统一所有路径的根）
  const root = {
    name: '/',
    path: '',
    isDirectory: true,
    statusCode: '',
    statusDesc: '',
    children: []
  };

  // 构建「路径→状态」映射，方便查找
  const pathStatusMap = new Map();
  statusItems.forEach(item => {
    pathStatusMap.set(item.path, {
      statusCode: item.statusCode,
      statusDesc: item.statusDesc,
      isDirectory: item.isDirectory
    });
  });

  // 遍历所有路径，逐层构建文件树
  pathStatusMap.forEach((statusInfo, fullPath) => {
    const pathParts = fullPath.split('/'); // 拆分路径：src/main/Conf.ts → ['src', 'main', 'Conf.ts']
    let currentNode = root;

    pathParts.forEach((part, index) => {
      const isLastPart = index === pathParts.length - 1;
      // 拼接当前节点的完整路径
      const currentPath = currentNode.path ? `${currentNode.path}/${part}` : part;

      // 检查当前层级是否已存在该节点（避免重复创建）
      let existingNode = currentNode.children.find(node => node.name === part);

      if (!existingNode) {
        // 创建新节点（区分文件夹/文件）
        existingNode = {
          name: part,
          path: currentPath,
          isDirectory: isLastPart ? statusInfo.isDirectory : true, // 非最后一段必为文件夹
          // 仅「最终节点」（文件/独立文件夹）携带状态
          statusCode: isLastPart ? statusInfo.statusCode : '',
          statusDesc: isLastPart ? statusInfo.statusDesc : '',
          children: [] // 文件夹默认有children，文件后续会清空
        };

        // 文件节点移除children
        if (isLastPart && !statusInfo.isDirectory) {
          delete existingNode.children;
        }

        currentNode.children.push(existingNode);
      }

      // 进入下一层级
      currentNode = existingNode;
    });
  });

  return root.children;
}
