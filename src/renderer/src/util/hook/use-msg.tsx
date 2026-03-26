import { message } from 'antd'

export const useMsg = () => {
  const [messageApi, context] = message.useMessage()
  return {
    context,
    success(msg: string, ...rest: any[]) {
      messageApi.success(msg)
      console.log(msg, ...rest)
    },
    error(msg: string, ...rest: any[]) {
      messageApi.error(msg)
      console.error(msg, ...rest)
    },
  }
}
