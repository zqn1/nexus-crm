import request from './request'

// ===== 原有接口 =====
export function getMockHealth() {
  return request.get('/health')
}

export function resetMockData() {
  return request.post('/mock/reset')
}

export function getMockError() {
  return request.get('/mock/error')
}

// ===== 客户管理接口（任务4新增） =====

// 1. 获取客户列表
export function getCustomerList(params) {
  return request.get('/customers', { params })
}

// 2. 新增客户
export function addCustomer(data) {
  return request.post('/customers', data)
}

// 3. 获取客户详情
export function getCustomerById(id) {
  return request.get(`/customers/${id}`)
}

// 4. 更新客户
export function updateCustomer(id, data) {
  return request.put(`/customers/${id}`, data)
}

// 5. 删除客户
export function deleteCustomer(id) {
  return request.delete(`/customers/${id}`)
}