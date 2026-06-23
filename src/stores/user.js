import { defineStore } from 'pinia'
import { login, logout, getProfile, getAuthRoutes, getPermissions } from '@/api/auth'
import {
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  getStoredMenus,
  setStoredMenus,
  getStoredPermissions,
  setStoredPermissions,
  clearAuthStorage,
} from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    userInfo: getStoredUser(),
    routes: getStoredMenus(),
    permissions: getStoredPermissions(),
    isLoggedIn: false,
  }),

  getters: {
    // 是否有某个权限
    hasPermission: (state) => (permission) => {
      if (!state.permissions || state.permissions.length === 0) return false
      if (state.permissions.includes('*')) return true
      return state.permissions.includes(permission)
    },

    // 是否有任意一个权限
    hasAnyPermission: (state) => (requiredPermissions) => {
      if (!state.permissions || state.permissions.length === 0) return false
      if (state.permissions.includes('*')) return true
      return requiredPermissions.some((p) => state.permissions.includes(p))
    },

    // 是否拥有所有权限
    hasAllPermissions: (state) => (requiredPermissions) => {
      if (!state.permissions || state.permissions.length === 0) return false
      if (state.permissions.includes('*')) return true
      return requiredPermissions.every((p) => state.permissions.includes(p))
    },
  },

  actions: {
    // ==================== 登录 ====================
    async loginAction(credentials) {
      try {
        const res = await login(credentials)
        if (res.code !== 0) {
          throw new Error(res.message || '登录失败')
        }

        this.token = res.data.token
        setToken(this.token)

        this.userInfo = res.data.user
        setStoredUser(this.userInfo)

        this.isLoggedIn = true

        await this.fetchRoutes()
        await this.fetchPermissions()

        return { success: true }
      } catch (error) {
        this.clearState()
        return {
          success: false,
          message: error.message || '登录失败，请检查网络',
        }
      }
    },

    // ==================== 恢复会话 ====================
    async restoreSession() {
      if (!this.token) {
        this.isLoggedIn = false
        return false
      }

      try {
        const profileRes = await getProfile()
        if (profileRes.code === 0) {
          this.userInfo = profileRes.data
          setStoredUser(this.userInfo)
          this.isLoggedIn = true

          await this.fetchRoutes()
          await this.fetchPermissions()
          return true
        } else {
          this.clearState()
          return false
        }
      } catch (error) {
        console.error('恢复会话失败:', error)
        if (error.code === 401) {
          this.clearState()
        } else {
          this.isLoggedIn = false
        }
        return false
      }
    },

    // ==================== 获取菜单 ====================
    async fetchRoutes() {
      if (!this.token) return
      try {
        const res = await getAuthRoutes()
        if (res.code === 0) {
          this.routes = res.data || []
          setStoredMenus(this.routes)
        }
      } catch (error) {
        console.error('获取菜单失败:', error)
      }
    },

    // ==================== 获取权限 ====================
    async fetchPermissions() {
      if (!this.token) return
      try {
        const res = await getPermissions()
        if (res.code === 0) {
          this.permissions = res.data || []
          setStoredPermissions(this.permissions)
        }
      } catch (error) {
        console.error('获取权限失败:', error)
      }
    },

    // ==================== 退出登录 ====================
    async logoutAction() {
      try {
        await logout()
      } catch (error) {
        console.error('退出请求失败:', error)
      } finally {
        this.clearState()
      }
    },

    // ==================== 清空状态 ====================
    clearState() {
      this.token = ''
      this.userInfo = null
      this.routes = []
      this.permissions = []
      this.isLoggedIn = false
      clearAuthStorage()
    },
  },
})