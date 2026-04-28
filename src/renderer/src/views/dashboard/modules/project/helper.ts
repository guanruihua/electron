export const openConfFile = async (path: string) => {
  if (!path) return
  return window.api.invoke('cmd', `code ${path}\\modules.json`)
}
