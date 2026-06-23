import { generateCustomers, DEMO_USERS, ROLES, MENUS, generateExtraUsers } from './seed'

const STORAGE_KEY = 'nexus_crm_mock_data'

export const mockStore = {
  // ===== 基础方法 =====
  read() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {}
    }
    return this.reset()
  },

  reset() {
    const customers = generateCustomers()
    const extraUsers = generateExtraUsers(10)
    const allUsers = [...DEMO_USERS, ...extraUsers]
    const data = {
      users: allUsers,
      customers,
      roles: ROLES,
      menus: MENUS,
      sessions: [], // 登录会话记录
      version: '1.0.0',
      seed: 2026,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
  },

  write(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // ===== 用户查询方法 =====
  findUserByUsername(username) {
    const data = this.read()
    const users = data.users || []
    return users.find((u) => u.username === username) || null
  },

  getUserById(id) {
    const data = this.read()
    const users = data.users || []
    return users.find((u) => u.id === id) || null
  },

  getRoles() {
    const data = this.read()
    return data.roles || []
  },

  getMenus() {
    const data = this.read()
    return data.menus || []
  },

  // 根据角色获取菜单
  getMenusByRole(roleId) {
    const menus = this.getMenus()
    return menus.filter((m) => m.roles.includes(roleId))
  },

  // 根据角色获取权限
  getPermissionsByRole(roleId) {
    const roles = this.getRoles()
    const role = roles.find((r) => r.id === roleId)
    return role ? role.permissions : []
  },

  // 记录登录会话
  addSession(userId, token) {
    const data = this.read()
    const sessions = data.sessions || []
    sessions.push({
      userId,
      token,
      createdAt: new Date().toISOString(),
    })
    data.sessions = sessions
    this.write(data)
  },

  // 验证 Token（简化版）
  validateToken(token) {
    const data = this.read()
    const sessions = data.sessions || []
    const session = sessions.find((s) => s.token === token)
    if (!session) return null
    return this.getUserById(session.userId)
  },

  // ===== 客户CRUD（已有） =====
  getCustomers() {
    const data = this.read()
    return data.customers || []
  },

  getCustomerList({ page = 1, pageSize = 10, keyword = '', role = '' } = {}) {
    let customers = this.getCustomers()
    if (keyword) {
      const kw = keyword.toLowerCase()
      customers = customers.filter(
        (c) =>
          c.name.includes(kw) ||
          c.phone.includes(kw) ||
          (c.email && c.email.toLowerCase().includes(kw))
      )
    }
    if (role) {
      customers = customers.filter((c) => c.role === role)
    }
    customers = [...customers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const total = customers.length
    const start = (page - 1) * pageSize
    const list = customers.slice(start, start + pageSize)
    return { list, total, page, pageSize }
  },

  getCustomerById(id) {
    const customers = this.getCustomers()
    return customers.find((c) => c.id === id) || null
  },

  addCustomer(data) {
    const allData = this.read()
    const customers = allData.customers || []
    const maxId = customers.reduce((max, c) => Math.max(max, c.id), 0)
    const newCustomer = {
      id: maxId + 1,
      ...data,
      createdAt: new Date().toISOString(),
    }
    allData.customers = [...customers, newCustomer]
    this.write(allData)
    return newCustomer
  },

  updateCustomer(id, data) {
    const allData = this.read()
    const customers = allData.customers || []
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return null
    const updated = {
      ...customers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    allData.customers = [...customers.slice(0, index), updated, ...customers.slice(index + 1)]
    this.write(allData)
    return updated
  },

  deleteCustomer(id) {
    const allData = this.read()
    const customers = allData.customers || []
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return false
    allData.customers = [...customers.slice(0, index), ...customers.slice(index + 1)]
    this.write(allData)
    return true
  },
}