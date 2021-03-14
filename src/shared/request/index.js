import axios from 'axios';

const service = axios.create({
  timeout: 60 * 1000, // 请求超时时间 60s
});

export function createRequest() {
  return function request(args) {
    return service(args)
  }
}


export default createRequest()
