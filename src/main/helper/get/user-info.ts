import { app } from 'electron'

export const getUserDataPath = () => {
  return app.getPath('userData')
}
