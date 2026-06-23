import axios from 'axios'
import { getToken, clearAuthStorage } from '@/utils/storage'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// ==================== 请求拦截器 ====================
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ==================== 响应拦截器 ====================
request.interceptors.response.use(
  (response) => {
    // 如果响应是blob或其他类型，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }

    const res = response.data

    // 如果code不等于0，抛出业务错误
    if (res.code !== undefined && res.code !== 0) {
      // 401：未授权，清理本地存储
      if (res.code === 401) {
        clearAuthStorage()
      }
      return Promise.reject(res)
    }

    return res
  },
  (error) => {
    // HTTP状态码处理
    if (error.response) {
      const status = error.response.status

      // 401：未授权
      if (status === 401) {
        clearAuthStorage()
        // 跳转到登录页
        if (typeof window !== 'undefined') {
          const router = window.$router
          if (router) {
            router.push('/login')
          } else {
            window.location.href = '/login'
          }
        }
        return Promise.reject({
          code: 401,
          message: '登录已过期，请重新登录',
          data: null,
        })
      }

      return Promise.reject({
        code: status,
        message: error.response.data?.message || '请求失败',
        data: error.response.data?.data || null,
      })
    }

    return Promise.reject({
      code: -1,
      message: '网络请求失败，请检查网络',
      data: null,
    })
  }
)

export default request