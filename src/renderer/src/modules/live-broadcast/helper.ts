import { req } from '@/util'
// import { DBName } from '@/store/conf'
// import { isObject } from 'asura-eye'
// import dayjs from 'dayjs'

// const url = 'https://api.live.bilibili.com/room/v1/Room/room_init'
// https://sessionhu.github.io/bilibili-API-collect/docs/live/info.html#%E8%8E%B7%E5%8F%96%E7%9B%B4%E6%92%AD%E9%97%B4%E4%BF%A1%E6%81%AF
// const tableName = 'bilibili-up'

// const getBiliBili_Up = async (uid: string) => {
//   if (!uid) return {}
//   const date = dayjs().format('YYYY-MM-DD')
//   const res_find = await window.api.db({
//     action: 'find',
//     tableName,
//     DBName,
//     payload: {
//       uid,
//       date,
//     },
//   })

//   const { data } = res_find?.data?.at(0) || {}
//   if (data) {
//     console.log(data)
//     return data
//   } else {
//     const res2 = await req(
//       'get',
//       'https://api.live.bilibili.com/live_user/v1/Master/info',
//       {
//         params: {
//           uid,
//         },
//       },
//     )
//     if (res2.status === 'success') {
//       const data = res2?.data?.data
//       if (data) {
//         await window.api.db({
//           action: 'update',
//           tableName,
//           DBName,
//           payload: {
//             uid,
//             date,
//             data,
//           },
//         })
//         return data
//       }
//       // console.log(res2)
//     }
//   }
//   return
// }

// export const getReqStatus = async (room_id: number) => {
//   const res = await req(
//     'get',
//     'https://api.live.bilibili.com/room/v1/Room/get_info',
//     {
//       params: {
//         room_id,
//       },
//     },
//   )
//   if (res.status !== 'success') return
//   const data = res?.data?.data
//   const data2 = await getBiliBili_Up(data?.uid)
//   // console.log('2: ', data2)
//   if (isObject(data2)) {
//     const { face, uname } = data2?.info || {}
//     if (uname) {
//       data.face = face
//       data.uname = uname
//     }
//   }
//   return data
// }

export const getReqStatusByUIDs = async (uids: number[]) => {
  const res = await req(
    'get',
    'https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids',
    {
      params: {
        uids,
      },
    },
  )
  // console.log(res)
  return res?.data?.data
}
