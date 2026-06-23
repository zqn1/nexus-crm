// ==================== Token ====================
const TOKEN_KEY = 'nexus_crm_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

// ==================== 用户信息 ====================
const USER_KEY = 'nexus_crm_user'

export function getStoredUser() {
  const data = localStorage.getItem(USER_KEY)
  try {
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// ==================== 菜单 ====================
const MENUS_KEY = 'nexus_crm_menus'

export function getStoredMenus() {
  const data = localStorage.getItem(MENUS_KEY)
  try {
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function setStoredMenus(menus) {
  localStorage.setItem(MENUS_KEY, JSON.stringify(menus))
}

// ==================== 权限 ====================
const PERMISSIONS_KEY = 'nexus_crm_permissions'

export function getStoredPermissions() {
  const data = localStorage.getItem(PERMISSIONS_KEY)
  try {
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function setStoredPermissions(permissions) {
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions))
}

// ==================== 清除所有认证数据 ====================
export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(MENUS_KEY)
  localStorage.removeItem(PERMISSIONS_KEY)
}