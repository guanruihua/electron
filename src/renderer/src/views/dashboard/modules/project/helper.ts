import { State } from "@/type"

export const openConfFile = async (state?: State) => {
  if (!state?.sysSetting?.path) return
  return window.api.invoke('cmd', `code ${state.sysSetting.path}\\modules.json`)
}
