export const SearchEngines = [
  {
    name: 'Google',
    url: 'https://www.google.com/search?q={keyword}',
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/search?q={keyword}',
  },
  {
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd={keyword}',
  },
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q={keyword}',
  },
  {
    name: 'Yahoo',
    url: 'https://search.yahoo.com/search?p={keyword}',
  },
  {
    name: 'Yandex',
    url: 'https://yandex.com/search/?text={keyword}',
  },
  {
    name: '搜狗',
    url: 'https://www.sogou.com/web?query={keyword}',
  },
  {
    name: 'Naver',
    url: 'https://search.naver.com/search.naver?query={keyword}',
  },
  {
    name: 'Ecosia',
    url: 'https://www.ecosia.org/search?q={keyword}',
  },
]

export function getSearchUrl(engine: string, keyword: string) {
  return SearchEngines.find((_) => _.name === engine)?.url?.replace(
    '{keyword}',
    encodeURIComponent(keyword),
  )
}
