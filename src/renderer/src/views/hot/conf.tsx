import InfoCard from './info-card'
import { TabsProps } from 'antd'

export const Conf: string[][] = [
  ['zhihu', '知乎', 'https://www.zhihu.com/hot'],
  ['sohu', '搜狐', 'https://news.sohu.com/'],
  ['jinjia', '金价', 'https://www.jinjia.com.cn/'],
]

export const items: TabsProps['items'] = Conf.map((_) => {
  const [key, label] = _
  return {
    key,
    label,
    children: <InfoCard type={key} />,
  }
})


