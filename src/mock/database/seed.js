import { fakerZH_CN as faker } from '@faker-js/faker'

faker.seed(2026)

const REFERENCE_DATE = new Date('2026-01-01T00:00:00.000Z')

// ==================== 简单密码加密 ====================
function encodePassword(password) {
  return btoa(password)
}

function decodePassword(encoded) {
  try {
    return atob(encoded)
  } catch {
    return null
  }
}

// 验证密码
export function verifyPassword(plainPassword, encodedPassword) {
  return encodePassword(plainPassword) === encodedPassword
}

// ==================== 固定演示账号 ====================
export const DEMO_USERS = [
  {
    id: 1,
    username: 'admin',
    password: encodePassword('Admin@2026'),
    name: '系统管理员',
    email: 'admin@nexus.com',
    phone: '13800000001',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'admin',
    roleName: '管理员',
    status: 'active',
    lastLoginAt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    username: 'manager',
    password: encodePassword('Admin@2026'),
    name: '张经理',
    email: 'manager@nexus.com',
    phone: '13800000002',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'manager',
    roleName: '经理',
    status: 'active',
    lastLoginAt: null,
    createdAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    username: 'sales',
    password: encodePassword('Admin@2026'),
    name: '李销售',
    email: 'sales@nexus.com',
    phone: '13800000003',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'sales',
    roleName: '销售人员',
    status: 'active',
    lastLoginAt: null,
    createdAt: '2026-01-03T00:00:00.000Z',
  },
  {
    id: 4,
    username: 'support',
    password: encodePassword('Admin@2026'),
    name: '王客服',
    email: 'support@nexus.com',
    phone: '13800000004',
    avatar: 'https://i.pravatar.cc/150?img=4',
    role: 'support',
    roleName: '客服人员',
    status: 'active',
    lastLoginAt: null,
    createdAt: '2026-01-04T00:00:00.000Z',
  },
  {
    id: 5,
    username: 'viewer',
    password: encodePassword('Admin@2026'),
    name: '赵观察员',
    email: 'viewer@nexus.com',
    phone: '13800000005',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'viewer',
    roleName: '观察员',
    status: 'active',
    lastLoginAt: null,
    createdAt: '2026-01-05T00:00:00.000Z',
  },
]

// ==================== 角色与权限 ====================
export const ROLES = [
  {
    id: 'admin',
    name: '管理员',
    permissions: ['*'],
  },
  {
    id: 'manager',
    name: '经理',
    permissions: [
      'dashboard:view',
      'customer:create',
      'customer:edit',
      'customer:delete',
      'opportunity:create',
      'contract:approve',
    ],
  },
  {
    id: 'sales',
    name: '销售人员',
    permissions: [
      'dashboard:view',
      'customer:create',
      'customer:edit',
      'opportunity:create',
    ],
  },
  {
    id: 'support',
    name: '客服人员',
    permissions: [
      'dashboard:view',
      'ticket:handle',
    ],
  },
  {
    id: 'viewer',
    name: '观察员',
    permissions: [
      'dashboard:view',
    ],
  },
]

// ==================== 菜单 ====================
export const MENUS = [
  {
    path: '/dashboard',
    title: '首页工作台',
    shortLabel: '首页',
    icon: 'HomeFilled',
    roles: ['admin', 'manager', 'sales', 'support', 'viewer'],
  },
  {
    path: '/customers',
    title: '客户管理',
    shortLabel: '客户',
    icon: 'User',
    roles: ['admin', 'manager', 'sales'],
  },
  {
    path: '/opportunities',
    title: '商机管理',
    shortLabel: '商机',
    icon: 'TrendCharts',
    roles: ['admin', 'manager', 'sales'],
  },
  {
    path: '/contracts',
    title: '合同管理',
    shortLabel: '合同',
    icon: 'DocumentCopy',
    roles: ['admin', 'manager'],
  },
  {
    path: '/tickets',
    title: '工单中心',
    shortLabel: '工单',
    icon: 'Tickets',
    roles: ['admin', 'support'],
  },
  {
    path: '/api-docs',
    title: '接口文档',
    shortLabel: '文档',
    icon: 'Document',
    roles: ['admin'],
  },
]

// ==================== 生成客户数据 ====================
function generateCustomer(index) {
  const id = index + 1
  const name = faker.person.fullName()
  const phone = faker.phone.number('1##########')
  const role = faker.helpers.arrayElement(['VIP', '普通', '潜在客户'])
  const email = faker.internet.email().toLowerCase()
  const company = faker.company.name()
  const createdAt = faker.date.between({
    from: REFERENCE_DATE,
    to: new Date(REFERENCE_DATE.getTime() + 30 * 24 * 60 * 60 * 1000),
  }).toISOString()
  return { id, name, phone, role, email, company, createdAt }
}

// ==================== 生成额外普通用户 ====================
export function generateExtraUsers(count = 10) {
  const extraUsers = []
  const surnames = ['张', '王', '李', '刘', '陈', '杨', '黄', '赵', '周', '吴']
  const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '洋']
  const roles = ['manager', 'sales', 'support', 'viewer']
  const roleNames = ['经理', '销售人员', '客服人员', '观察员']
  const statuses = ['active', 'active', 'active', 'disabled']

  for (let i = 0; i < count; i++) {
    const idx = i % 10
    const roleIdx = i % 4
    const statusIdx = i % 4
    const id = 100 + i
    const name = surnames[idx % surnames.length] + names[idx % names.length]
    extraUsers.push({
      id: id,
      username: `user${id}`,
      password: encodePassword('Admin@2026'),
      name: name,
      email: `user${id}@example.com`,
      phone: `138${String(10000000 + i).padStart(8, '0')}`,
      avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      role: roles[roleIdx],
      roleName: roleNames[roleIdx],
      status: statuses[statusIdx],
      lastLoginAt: null,
      createdAt: faker.date.between({
        from: REFERENCE_DATE,
        to: new Date(REFERENCE_DATE.getTime() + 30 * 24 * 60 * 60 * 1000),
      }).toISOString(),
    })
  }
  return extraUsers
}

// ==================== 导出函数 ====================
export function generateCustomers() {
  return Array.from({ length: 10 }, (_, i) => generateCustomer(i))
}