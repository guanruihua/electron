import { ObjectType } from '0type'
import { ProjectConf } from '@/type'
import { isArray } from 'asura-eye'
const url_jenkins = 'https://jenkins.yessafe.com.cn'

export const getFSStatus = async (path: string) => {
  if (!path) return
  const res = await window.api.fs('readCurrentDir', { path })
  if (!isArray(res)) return
  const status = {
    'package.json': false,
    node_modules: false,
  }
  const keys = Object.keys(status)
  for (let i = 0; i < res.length; i++) {
    const item = res[i]
    if (keys.includes(item.name)) {
      status[item.name] = true
    }
  }
  return status
}

export const getJenkins = (
  item: ProjectConf,
  Data: ObjectType,
): ProjectConf['Jenkins'] | undefined => {
  
  const url_frontend = item?.[`url-frontend`] || ''
  const url_backend = item?.['url-backend'] || ''

  const show_jenkins =
    url_backend?.indexOf(url_jenkins) > -1 ||
    url_frontend?.indexOf(url_jenkins) > -1

  if (show_jenkins) {
    const frontend_list = Data[url_frontend]?.list || []
    const backend_list = Data[url_backend]?.list || []

    return {
      url_frontend,
      frontend_list,
      frontend_status: frontend_list?.at(0)?.status || 'error',
      url_backend,
      backend_list,
      backend_status: backend_list?.at(0)?.status || 'error',
    }
  }
  return
}
