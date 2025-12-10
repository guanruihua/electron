// managers/configManager.js
const { app } = require('electron')
const path = require('path')
const fs = require('fs').promises

export class StoreManager {
  configDir = path.join(app.getPath('userData'), 'config')
  configFile = path.join(this.configDir, 'settings.json')
  schemaFile = path.join(this.configDir, 'schema.json')
  defaultsFile = path.join(this.configDir, 'defaults.json')
  config = {}
  schema = {}
  defaults = {}
  initPromise = this.initialize()

  constructor() {
    // this.configDir = path.join(app.getPath('userData'), 'config')
    // this.configFile = path.join(this.configDir, 'settings.json')
    // this.schemaFile = path.join(this.configDir, 'schema.json')
    // this.defaultsFile = path.join(this.configDir, 'defaults.json')
    // this.config = {}
    // this.schema = {}
    // this.defaults = {}
    // this.initPromise = this.initialize()
  }

  async initialize() {
    try {
      // 确保配置目录存在
      await fs.mkdir(this.configDir, { recursive: true })

      // 加载schema
      await this.loadSchema()

      // 加载默认值
      await this.loadDefaults()

      // 加载配置
      await this.loadConfig()

      console.log('配置管理器初始化完成')
    } catch (error) {
      console.error('配置管理器初始化失败:', error)
      throw error
    }
  }

  async loadSchema() {
    try {
      const data = await fs.readFile(this.schemaFile, 'utf8')
      this.schema = JSON.parse(data)
    } catch (error) {
      console.error(error)
    }
  }

  async saveSchema() {
    const data = JSON.stringify(this.schema, null, 2)
    await fs.writeFile(this.schemaFile, data, 'utf8')
  }

  async loadDefaults() {
    try {
      const data = await fs.readFile(this.defaultsFile, 'utf8')
      this.defaults = JSON.parse(data)
    } catch (error) {
      console.error(error)
    }
  }

  async saveDefaults() {
    const data = JSON.stringify(this.defaults, null, 2)
    await fs.writeFile(this.defaultsFile, data, 'utf8')
  }

  async loadConfig() {
    try {
      const data = await fs.readFile(this.configFile, 'utf8')
      const loadedConfig = JSON.parse(data)

      // 验证和合并配置
      this.config = this.validateAndMerge(loadedConfig)

      // 如果有新增的配置项，保存更新后的配置
      await this.saveConfig()
    } catch (error) {
      console.error(error)
    }
  }

  async saveConfig() {
    const data = JSON.stringify(this.config, null, 2)
    await fs.writeFile(this.configFile, data, 'utf8')
  }

  validateAndMerge(loadedConfig) {
    const merged = { ...this.defaults }

    // 递归合并配置
    const merge = (target, source) => {
      for (const key in source) {
        if (
          source[key] &&
          typeof source[key] === 'object' &&
          !Array.isArray(source[key])
        ) {
          if (!target[key] || typeof target[key] !== 'object') {
            target[key] = {}
          }
          merge(target[key], source[key])
        } else {
          target[key] = source[key]
        }
      }
    }

    merge(merged, loadedConfig)

    // 验证配置
    this.validateConfig(merged)

    return merged
  }

  validateConfig(config) {
    const validate = (schema, data, path = '') => {
      for (const key in schema) {
        const fullPath = path ? `${path}.${key}` : key
        const rule = schema[key]

        if (rule.required && (data[key] === undefined || data[key] === null)) {
          console.warn(`配置项 ${fullPath} 缺失，使用默认值`)
          data[key] = rule.default
        }

        if (data[key] !== undefined && data[key] !== null) {
          // 类型检查
          if (rule.type && typeof data[key] !== rule.type) {
            console.warn(
              `配置项 ${fullPath} 类型错误，期望 ${rule.type}，得到 ${typeof data[key]}`,
            )
            data[key] = rule.default
          }

          // 枚举检查
          if (rule.enum && !rule.enum.includes(data[key])) {
            console.warn(
              `配置项 ${fullPath} 值无效，允许的值: ${rule.enum.join(', ')}`,
            )
            data[key] = rule.default
          }

          // 范围检查
          if (rule.min !== undefined && data[key] < rule.min) {
            console.warn(`配置项 ${fullPath} 值太小，最小值为 ${rule.min}`)
            data[key] = rule.min
          }

          if (rule.max !== undefined && data[key] > rule.max) {
            console.warn(`配置项 ${fullPath} 值太大，最大值为 ${rule.max}`)
            data[key] = rule.max
          }

          // 递归验证对象
          if (rule.properties && data[key] && typeof data[key] === 'object') {
            validate(rule.properties, data[key], fullPath)
          }
        }
      }
    }

    validate(this.schema, config)
  }

  getDefaultSchema() {
    return {
      app: {
        type: 'object',
        properties: {
          name: { type: 'string', default: app.name },
          version: { type: 'string', default: app.getVersion() },
        },
      },
      window: {
        type: 'object',
        properties: {
          width: { type: 'number', default: 800, min: 400, max: 3840 },
          height: { type: 'number', default: 600, min: 300, max: 2160 },
          x: { type: 'number', default: null },
          y: { type: 'number', default: null },
          maximized: { type: 'boolean', default: false },
          fullscreen: { type: 'boolean', default: false },
        },
      },
      settings: {
        type: 'object',
        properties: {
          theme: {
            type: 'string',
            default: 'system',
            enum: ['light', 'dark', 'system'],
          },
          language: {
            type: 'string',
            default: 'zh-CN',
            enum: ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'],
          },
          autoUpdate: { type: 'boolean', default: true },
          notifications: { type: 'boolean', default: true },
          startMinimized: { type: 'boolean', default: false },
          autoStart: { type: 'boolean', default: false },
        },
      },
      editor: {
        type: 'object',
        properties: {
          fontSize: { type: 'number', default: 14, min: 8, max: 72 },
          fontFamily: { type: 'string', default: 'Consolas, monospace' },
          lineHeight: { type: 'number', default: 1.5, min: 1, max: 3 },
          tabSize: { type: 'number', default: 2, min: 1, max: 8 },
          wordWrap: { type: 'boolean', default: true },
        },
      },
      network: {
        type: 'object',
        properties: {
          proxy: { type: 'string', default: '' },
          timeout: { type: 'number', default: 30000, min: 1000, max: 300000 },
        },
      },
    }
  }

  getDefaultValues() {
    const defaults = {}
    const extractDefaults = (schema, target) => {
      for (const key in schema) {
        const rule = schema[key]
        if (rule.properties) {
          target[key] = {}
          extractDefaults(rule.properties, target[key])
        } else if (rule.default !== undefined) {
          target[key] = rule.default
        }
      }
    }

    extractDefaults(this.schema, defaults)
    return defaults
  }

  // 获取配置
  get(key, defaultValue = undefined) {
    const keys = key.split('.')
    let value = this.config

    for (const k of keys) {
      if (value === null || value === undefined || typeof value !== 'object') {
        return defaultValue
      }
      value = value[k]
    }

    return value !== undefined ? value : defaultValue
  }

  // 设置配置
  set(key, value) {
    const keys = key.split('.')
    let current = this.config

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!current[k] || typeof current[k] !== 'object') {
        current[k] = {}
      }
      current = current[k]
    }

    const lastKey = keys[keys.length - 1]
    current[lastKey] = value

    // 验证设置的值
    this.validateSet(key, value)

    // 自动保存
    this.saveConfig()

    return true
  }

  validateSet(key, value) {
    const schemaPath = this.getSchemaPath(key)
    if (!schemaPath) {
      console.warn(`配置项 ${key} 不在schema中`)
      return
    }

    const rule: any = schemaPath[schemaPath.length - 1]

    // 类型检查
    if (rule.type && typeof value !== rule.type) {
      throw new Error(
        `配置项 ${key} 类型错误，期望 ${rule.type}，得到 ${typeof value}`,
      )
    }

    // 枚举检查
    if (rule.enum && !rule.enum.includes(value)) {
      throw new Error(`配置项 ${key} 值无效，允许的值: ${rule.enum.join(', ')}`)
    }

    // 范围检查
    if (rule.min !== undefined && value < rule.min) {
      throw new Error(`配置项 ${key} 值太小，最小值为 ${rule.min}`)
    }

    if (rule.max !== undefined && value > rule.max) {
      throw new Error(`配置项 ${key} 值太大，最大值为 ${rule.max}`)
    }
  }

  getSchemaPath(key) {
    const keys = key.split('.')
    let current: any = this.schema
    const path:any[] = []

    for (const k of keys) {
      if (!current[k]) {
        return null
      }
      path.push(current[k])
      if (current[k].properties) {
        current = current[k].properties
      } else {
        current = {}
      }
    }

    return path
  }

  // 监听配置变化
  on(key, callback) {
    const originalValue = this.get(key)

    const checkAndNotify = () => {
      const newValue = this.get(key)
      if (JSON.stringify(newValue) !== JSON.stringify(originalValue)) {
        callback(newValue, originalValue)
      }
    }

    // 定期检查配置变化
    const interval = setInterval(checkAndNotify, 1000)

    return () => clearInterval(interval)
  }

  // 重置配置
  reset(key = null) {
    if (key) {
      const defaultValue = this.getDefaultValue(key)
      this.set(key, defaultValue)
    } else {
      this.config = { ...this.defaults }
      this.saveConfig()
    }
  }

  getDefaultValue(key) {
    const keys = key.split('.')
    let value = this.defaults

    for (const k of keys) {
      if (value === null || value === undefined || typeof value !== 'object') {
        return undefined
      }
      value = value[k]
    }

    return value
  }

  // 导出配置
  export() {
    return {
      config: this.config,
      schema: this.schema,
      defaults: this.defaults,
      version: app.getVersion(),
      exportedAt: new Date().toISOString(),
    }
  }

  // 导入配置
  async import(data) {
    if (data.version && data.version !== app.getVersion()) {
      console.warn(`配置版本不匹配: ${data.version} -> ${app.getVersion()}`)
    }

    if (data.config) {
      this.config = this.validateAndMerge(data.config)
      await this.saveConfig()
    }

    if (data.schema) {
      this.schema = data.schema
      await this.saveSchema()
    }

    if (data.defaults) {
      this.defaults = data.defaults
      await this.saveDefaults()
    }

    return true
  }
}
