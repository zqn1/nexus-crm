import { generateUsers, generateCustomers } from './seed'

const STORAGE_KEY = 'nexus_crm_mock_data'

export const mockStore = {
  // ===== 基础方法 =====

  /**
   * 读取数据，若无数据则自动初始化
   */
  read() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        // 解析失败则重置
      }
    }
    return this.reset()
  },

  /**
   * 重置数据（重新生成固定种子数据）
   */
  reset() {
    const users = generateUsers()
    const customers = generateCustomers()
    const data = {
      users,
      customers,
      version: '1.0.0',
      seed: 2026,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
  },

  /**
   * 写入数据
   */
  write(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  // ===== 客户管理 CRUD 方法 =====

  /**
   * 获取所有客户
   */
  getCustomers() {
    const data = this.read()
    return data.customers || []
  },

  /**
   * 获取客户列表（支持分页、搜索、筛选）
   */
  getCustomerList({ page = 1, pageSize = 10, keyword = '', role = '' } = {}) {
    let customers = this.getCustomers()

    // 搜索
    if (keyword) {
      const kw = keyword.toLowerCase()
      customers = customers.filter(
        (c) =>
          c.name.includes(kw) ||
          c.phone.includes(kw) ||
          (c.email && c.email.toLowerCase().includes(kw))
      )
    }

    // 角色筛选
    if (role) {
      customers = customers.filter((c) => c.role === role)
    }

    // 排序（按创建时间倒序）
    customers = [...customers].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    const total = customers.length
    const start = (page - 1) * pageSize
    const list = customers.slice(start, start + pageSize)

    return { list, total, page, pageSize }
  },

  /**
   * 根据 ID 获取单个客户
   */
  getCustomerById(id) {
    const customers = this.getCustomers()
    return customers.find((c) => c.id === id) || null
  },

  /**
   * 新增客户
   */
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

  /**
   * 更新客户
   */
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
    allData.customers = [
      ...customers.slice(0, index),
      updated,
      ...customers.slice(index + 1),
    ]
    this.write(allData)
    return updated
  },

  /**
   * 删除客户
   */
  deleteCustomer(id) {
    const allData = this.read()
    const customers = allData.customers || []
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return false
    allData.customers = [
      ...customers.slice(0, index),
      ...customers.slice(index + 1),
    ]
    this.write(allData)
    return true
  },
}