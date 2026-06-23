import { http, HttpResponse } from 'msw'
import { mockStore } from '../database/store'
import { verifyPassword } from '../database/seed'

function successResponse(data, message = '操作成功') {
  return HttpResponse.json({ code: 0, message, data })
}

function errorResponse(message = '操作失败', code = -1, status = 400) {
  return HttpResponse.json({ code, message, data: null }, { status })
}

// ==================== 生成 Token ====================
function generateToken(userId) {
  return `token_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
}

export const handlers = [
  // ===== 原有接口 =====
  http.get('/api/health', () => {
    const data = mockStore.read()
    return successResponse({
      status: 'healthy',
      version: data.version,
      seed: data.seed,
      usersCount: data.users?.length || 0,
      customersCount: data.customers?.length || 0,
      updatedAt: data.updatedAt,
    })
  }),

  http.post('/api/mock/reset', () => {
    const data = mockStore.reset()
    return successResponse({
      version: data.version,
      seed: data.seed,
      usersCount: data.users?.length || 0,
      customersCount: data.customers?.length || 0,
      updatedAt: data.updatedAt,
    }, '模拟数据已重置')
  }),

  http.get('/api/mock/error', () => {
    return HttpResponse.json(
      { code: -1, message: '模拟服务器内部错误', data: null },
      { status: 500 }
    )
  }),

  // ===== 认证接口 =====

  // POST /api/auth/login - 登录
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return errorResponse('请输入账号和密码', -1, 400)
    }

    // 查找用户
    const user = mockStore.findUserByUsername(username)
    if (!user) {
      return errorResponse('账号或密码错误', -1, 401)
    }

    // 检查状态
    if (user.status === 'disabled') {
      return errorResponse('账号已被禁用，请联系管理员', -1, 403)
    }

    // 验证密码（使用加密验证）
    if (!verifyPassword(password, user.password)) {
      return errorResponse('账号或密码错误', -1, 401)
    }

    // 生成 Token
    const token = generateToken(user.id)

    // 记录会话
    mockStore.addSession(user.id, token)

    // 更新最后登录时间
    const allData = mockStore.read()
    const users = allData.users || []
    const index = users.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      users[index].lastLoginAt = new Date().toISOString()
      allData.users = users
      mockStore.write(allData)
    }

    // 返回登录成功（不包含密码）
    const { password: _, ...userWithoutPassword } = user
    return successResponse({
      token,
      user: userWithoutPassword,
    }, '登录成功')
  }),

  // POST /api/auth/logout - 退出登录
  http.post('/api/auth/logout', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const data = mockStore.read()
      data.sessions = (data.sessions || []).filter((s) => s.token !== token)
      mockStore.write(data)
    }
    return successResponse(null, '退出成功')
  }),

  // GET /api/auth/profile - 获取用户资料
  http.get('/api/auth/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('未授权，请先登录', 401, 401)
    }

    const token = authHeader.substring(7)
    const user = mockStore.validateToken(token)

    if (!user) {
      return errorResponse('Token 无效或已过期', 401, 401)
    }

    const { password, ...userWithoutPassword } = user
    return successResponse(userWithoutPassword)
  }),

  // GET /api/auth/routes - 获取当前用户菜单
  http.get('/api/auth/routes', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('未授权，请先登录', 401, 401)
    }

    const token = authHeader.substring(7)
    const user = mockStore.validateToken(token)

    if (!user) {
      return errorResponse('Token 无效或已过期', 401, 401)
    }

    const menus = mockStore.getMenusByRole(user.role)
    return successResponse(menus)
  }),

  // GET /api/auth/permissions - 获取当前用户权限
  http.get('/api/auth/permissions', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('未授权，请先登录', 401, 401)
    }

    const token = authHeader.substring(7)
    const user = mockStore.validateToken(token)

    if (!user) {
      return errorResponse('Token 无效或已过期', 401, 401)
    }

    const permissions = mockStore.getPermissionsByRole(user.role)
    return successResponse(permissions)
  }),

  // ===== 客户管理接口 =====

  // GET /api/customers - 获取客户列表
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

  // POST /api/customers - 新增客户
  http.post('/api/customers', async ({ request }) => {
    const body = await request.json()
    const { name, phone, role, email, company } = body

    if (!name || !phone) {
      return errorResponse('姓名和手机号为必填项', -1, 400)
    }

    const newCustomer = mockStore.addCustomer({ name, phone, role, email, company })
    return successResponse(newCustomer, '客户创建成功')
  }),

  // GET /api/customers/:id - 获取客户详情
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

  // PUT /api/customers/:id - 更新客户信息
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

  // DELETE /api/customers/:id - 删除客户
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