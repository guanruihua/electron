import React from 'react'

export const useOwnState = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const uploadRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.addEventListener('paste', function (e) {
      console.log('🚀 ~ Search / paste~ e:', e.clipboardData?.files)
    })
  }, [inputRef.current])

  return {
    inputRef,
    uploadRef,
  }
}
