import fsp from 'fs/promises'

export async function deleteFile(url: string): Promise<boolean> {
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