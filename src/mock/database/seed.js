import { fakerZH_CN as faker } from '@faker-js/faker'

faker.seed(2026)

const REFERENCE_DATE = new Date('2026-01-01T00:00:00.000Z')

// 用户数据
function generateUser(index) {
  const id = index + 1
  const name = faker.person.fullName()
  const phone = faker.phone.number('1##########')
  const role = faker.helpers.arrayElement(['管理员', '编辑', '访客'])
  const createdAt = faker.date.between({
    from: REFERENCE_DATE,
    to: new Date(REFERENCE_DATE.getTime() + 30 * 24 * 60 * 60 * 1000),
  }).toISOString()
  return { id, name, phone, role, createdAt }
}

// 客户数据（必须有这个）
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

export function generateUsers() {
  return Array.from({ length: 5 }, (_, i) => generateUser(i))
}

// 导出客户生成函数（必须有）
export function generateCustomers() {
  return Array.from({ length: 10 }, (_, i) => generateCustomer(i))
}