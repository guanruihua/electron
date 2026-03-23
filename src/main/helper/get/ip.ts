import os from 'os'

export function getLocalIP() {
  const interfaces: NodeJS.Dict<os.NetworkInterfaceInfo[]> =
    os.networkInterfaces()
  if (interfaces)
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]!) {
        // 过滤 IPv4、非内部回环、且为 family IPv4
        if (
          iface.family === 'IPv4' &&
          !iface.internal &&
          !iface.address.endsWith('.0.1')
        ) {
          return iface.address
        }
      }
    }
  return '0.0.0.0'
}
