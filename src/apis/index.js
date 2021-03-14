import { SINA_API } from '@/constants/index'
import request from '@/shared/request'

const sinaApi = (codes) => request({
  method: 'get',
  url: `${SINA_API}${codes.join(',')}`,
})


export default {
  sinaApi,
}
