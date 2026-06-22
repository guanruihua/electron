import { req } from '@/util'

// const url = 'https://api.live.bilibili.com/room/v1/Room/room_init'
// https://sessionhu.github.io/bilibili-API-collect/docs/live/info.html#%E8%8E%B7%E5%8F%96%E7%9B%B4%E6%92%AD%E9%97%B4%E4%BF%A1%E6%81%AF
export const getReqStatus = async (room_id: number) => {
  const res = await req(
    'get',
    'https://api.live.bilibili.com/room/v1/Room/get_info',
    {
      params: {
        room_id,
      },
    },
  )
  if (res.status !== 'success') return
  const data = res?.data?.data
  if (data?.uid) {
    const res2 = await req(
      'get',
      'https://api.live.bilibili.com/live_user/v1/Master/info',
      {
        params: {
          uid: data.uid,
        },
      },
    )
    if (res2.status === 'success') {
      const { face, uname } = res2?.data?.data?.info || {}
      if (uname) {
        data.face = face
        data.uname = uname
      }
      // console.log(res2)
    }
  }
  return data
}
