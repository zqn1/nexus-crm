import request from './request'

/**
 * 登录
 */
export function login(credentials) {
  return request.post('/auth/login', credentials)
}

/**
 * 退出登录
 */
export function logout() {
  return request.post('/auth/logout')
}

/**
 * 获取当前用户资料
 */
export function getProfile() {
  return request.get('/auth/profile')
}

/**
 * 获取当前用户菜单
 */
export function getAuthRoutes() {
  return request.get('/auth/routes')
}

/**
 * 获取当前用户权限
 */
export function getPermissions() {
  return request.get('/auth/permissions')
}