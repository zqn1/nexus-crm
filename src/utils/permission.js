/**
 * 判断是否有某个权限
 */
export function hasPermission(permissions, permission) {
    if (!permissions || permissions.length === 0) return false
    // * 表示超级管理员，拥有所有权限
    if (permissions.includes('*')) return true
    return permissions.includes(permission)
  }
  
  /**
   * 判断是否有任意一个权限
   */
  export function hasAnyPermission(permissions, requiredPermissions) {
    if (!permissions || permissions.length === 0) return false
    if (permissions.includes('*')) return true
    return requiredPermissions.some((p) => permissions.includes(p))
  }
  
  /**
   * 判断是否拥有所有权限
   */
  export function hasAllPermissions(permissions, requiredPermissions) {
    if (!permissions || permissions.length === 0) return false
    if (permissions.includes('*')) return true
    return requiredPermissions.every((p) => permissions.includes(p))
  }