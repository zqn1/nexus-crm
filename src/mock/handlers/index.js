import { http, HttpResponse } from 'msw'
import { mockStore } from '../database/store'

function successResponse(data, message = '操作成功') {
  return HttpResponse.json({ code: 0, message, data })
}

function errorResponse(message = '操作失败', code = -1, status = 400) {
  return HttpResponse.json({ code, message, data: null }, { status })
}

export const handlers = [
  // ===== 原有接口 =====
  http.get('/api/health', () => {
    const data = mockStore.read()
    return successResponse({
      status: 'healthy',
      version: data.version,
      seed: data.seed,
      usersCount: data.users.length,
      updatedAt: data.updatedAt,
    })
  }),

  http.post('/api/mock/reset', () => {
    const data = mockStore.reset()
    return successResponse(
      {
        version: data.version,
        seed: data.seed,
        usersCount: data.users.length,
        customersCount: data.customers?.length || 0,
        updatedAt: data.updatedAt,
      },
      '模拟数据已重置'
    )
  }),

  http.get('/api/mock/error', () => {
    return HttpResponse.json(
      { code: -1, message: '模拟服务器内部错误', data: null },
      { status: 500 }
    )
  }),

  // ===== 客户管理接口（任务4新增） =====

  // 1. GET /api/customers - 获取客户列表
  http.get('/api/customers', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const keyword = url.searchParams.get('keyword') || ''
    const role = url.searchParams.get('role') || ''

    const result = mockStore.getCustomerList({ page, pageSize, keyword, role })
    return successResponse({
      list: result.list,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    })
  }),

  // 2. POST /api/customers - 新增客户
  http.post('/api/customers', async ({ request }) => {
    const body = await request.json()
    const { name, phone, role, email, company } = body

    if (!name || !phone) {
      return errorResponse('姓名和手机号为必填项', -1, 400)
    }

    const newCustomer = mockStore.addCustomer({ name, phone, role, email, company })
    return successResponse(newCustomer, '客户创建成功')
  }),

  // 3. GET /api/customers/:id - 获取客户详情
  http.get('/api/customers/:id', ({ params }) => {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return errorResponse('无效的客户ID', -1, 400)
    }
    const customer = mockStore.getCustomerById(id)
    if (!customer) {
      return errorResponse('客户不存在', 404, 404)
    }
    return successResponse(customer)
  }),

  // 4. PUT /api/customers/:id - 更新客户信息
  http.put('/api/customers/:id', async ({ params, request }) => {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return errorResponse('无效的客户ID', -1, 400)
    }
    const body = await request.json()
    const updated = mockStore.updateCustomer(id, body)
    if (!updated) {
      return errorResponse('客户不存在', 404, 404)
    }
    return successResponse(updated, '客户信息更新成功')
  }),

  // 5. DELETE /api/customers/:id - 删除客户
  http.delete('/api/customers/:id', ({ params }) => {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return errorResponse('无效的客户ID', -1, 400)
    }
    const success = mockStore.deleteCustomer(id)
    if (!success) {
      return errorResponse('客户不存在', 404, 404)
    }
    return successResponse(null, '客户删除成功')
  }),
]