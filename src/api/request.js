import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',     // 所有请求都以 /api 开头
  timeout: 10000,
})

// 请求拦截器（可选）
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器（可选）
request.interceptors.response.use(
  (response) => {
    // 直接返回 data，方便调用
    return response.data
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      // 服务器返回了错误状态码
      return Promise.reject(error.response.data)
    } else {
      // 网络错误或其他
      return Promise.reject({ message: '网络请求失败' })
    }
  }
)

export default request