import fsp from 'fs/promises'
import { FS_Payload } from './type'

export async function deleteFile(payload: FS_Payload): Promise<boolean> {
  const url = payload.path
  if (!url) return false
  try {
    await fsp.unlink(url)
    console.log('Handle Delete File Success')
    return true
  } catch (error) {
    console.log('Handle Delete File Error')
    return false
  }
}
