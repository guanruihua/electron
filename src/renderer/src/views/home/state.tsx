import { useSetState } from '0hook'
import { PageState } from './type'

export const usePageState = () => {
  const [state, setState] = useSetState<PageState>({
    activeTab: '1',
    tabs: [
      {
        id: '1',
        title: 'Qubit Safe',
        url: 'http://172.16.30.53:5173/discovery',
      },
      {
        id: '2',
        title: 'Bing',
        url: 'https://www.bing.com',
      },
      {
        id: '3',
        title: 'Baidu',
        url: 'https://www.baidu.com',
      },
    ],
    canGoBack: false,
    canGoForward: false,
  })
  
  return {
    state,
    setState,
    handle: {
      close() {
        window.api.close()
      },
      min() {
        window.api.minimize()
      },
      max() {
        window.api.maximize()
      },
    },
  }
}
