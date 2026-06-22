const content = `# NexusCRM

基于 Vue 3 + Vite 构建的企业级客户关系管理系统前端。

## 📌 项目简介

NexusCRM 是一个客户关系管理系统的前端项目，采用现代化的前端技术栈，具备完整的后台布局、路由管理、状态管理和模拟接口能力。项目采用模块化设计，便于后续功能扩展和维护。

## 🚀 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | ^3.4.0 | 渐进式 JavaScript 框架 |
| Vite | ^5.0.0 | 新一代前端构建工具 |
| Vue Router | ^4.3.0 | Vue 官方路由管理器 |
| Pinia | ^2.1.7 | Vue 官方状态管理库 |
| Element Plus | ^2.6.0 | 基于 Vue 3 的组件库 |
| Axios | ^1.6.0 | 基于 Promise 的 HTTP 客户端 |
| ECharts | ^5.5.0 | 数据可视化图表库 |
| Sass | ^1.69.0 | CSS 预处理器 |
| MSW | latest | API 模拟工具 |
| Faker.js | latest | 模拟数据生成器 |

## 📦 快速开始

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

开发服务器默认运行在 \`http://localhost:3000\`，如果端口被占用会自动切换（如 \`3001\`）。

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

### 预览生产构建

\`\`\`bash
npm run preview
\`\`\`

## 📁 目录结构

\`\`\`
nexus-crm/
├── public/
│   └── mockServiceWorker.js    # MSW 服务 Worker
├── src/
│   ├── api/                    # API 请求封装
│   │   ├── request.js          # Axios 实例配置
│   │   └── mock.js             # 模拟接口函数
│   ├── components/             # 公共组件（待扩展）
│   ├── layout/                 # 后台布局组件
│   │   ├── Layout.vue          # 主布局
│   │   ├── Sidebar.vue         # 侧边栏
│   │   ├── HeaderBar.vue       # 顶部栏
│   │   └── Breadcrumb.vue      # 面包屑
│   ├── mock/                   # 模拟数据与接口
│   │   ├── browser.js          # MSW 启动文件
│   │   ├── database/
│   │   │   ├── seed.js         # Faker 数据生成
│   │   │   └── store.js        # 数据读写与重置
│   │   └── handlers/
│   │       └── index.js        # MSW 请求拦截器
│   ├── router/                 # 路由配置
│   │   ├── index.js            # 路由定义
│   │   └── menu.js             # 静态菜单配置
│   ├── stores/                 # Pinia 状态管理
│   │   └── index.js            # 应用状态（侧边栏折叠）
│   ├── styles/                 # 全局样式
│   │   ├── variables.scss      # SCSS 变量
│   │   └── index.scss          # 全局样式入口
│   ├── views/                  # 页面组件
│   │   ├── Login.vue           # 登录页
│   │   ├── Dashboard.vue       # 首页工作台
│   │   ├── Forbidden.vue       # 403 页面
│   │   ├── NotFound.vue        # 404 页面
│   │   └── api-docs/
│   │       └── ApiDocsView.vue # 接口文档页
│   ├── App.vue                 # 根组件
│   └── main.js                 # 应用入口
├── index.html                  # HTML 模板
├── vite.config.js              # Vite 配置
├── package.json                # 项目配置
└── README.md                   # 项目文档
\`\`\`

## 📊 开发进度

| 任务 | 状态 | 说明 |
|------|------|------|
| 任务1：项目初始化与工程规范 | ✅ 已完成 | Vue3 + Vite 项目搭建，集成 Element Plus、Pinia、Sass |
| 任务2：后台主布局与基础路由 | ✅ 已完成 | 侧边栏、顶部栏、面包屑，路由配置，登录/403/404 页面 |
| 任务3：模拟接口与接口文档页 | ✅ 已完成 | MSW 模拟接口，Faker 数据生成，接口文档页在线调试 |
| 选做：500 异常接口 | ✅ 已完成 | 模拟服务器错误，展示错误响应 |
| 选做：请求参数区域 | ✅ 已完成 | 接口文档页支持参数输入 |
| 选做：结构关系图 | ✅ 已完成 | 见下方 Layout 与 RouterView 结构关系 |
| 选做：客户接口清单 | ✅ 已完成 | 见下方客户管理模块接口清单 |

## 🏗️ Layout 与 RouterView 结构关系

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         App.vue                                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    <router-view />                        │ │
│  │                    (根路由出口)                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Layout.vue                             │ │
│  │  ┌───────────┐  ┌──────────────────────────────────────┐ │ │
│  │  │  Sidebar  │  │            main-wrapper              │ │ │
│  │  │  侧边栏   │  │  ┌────────────────────────────────┐  │ │ │
│  │  │           │  │  │       HeaderBar 顶部栏          │  │ │ │
│  │  │ 菜单列表  │  │  │  [折叠按钮] 系统名  用户信息   │  │ │ │
│  │  │ - 首页    │  │  └────────────────────────────────┘  │ │ │
│  │  │ - 接口文档│  │  ┌────────────────────────────────┐  │ │ │
│  │  │ - 403示例 │  │  │      Breadcrumb 面包屑          │  │ │ │
│  │  │ - (禁用)  │  │  │  首页 / 当前页面标题            │  │ │ │
│  │  │           │  │  └────────────────────────────────┘  │ │ │
│  │  │ 折叠时    │  │  ┌────────────────────────────────┐  │ │ │
│  │  │ 宽度64px  │  │  │         app-main              │  │ │ │
│  │  │ 展开时    │  │  │  ┌──────────────────────────┐  │ │ │
│  │  │ 宽度220px │  │  │  │   <router-view />        │  │ │ │
│  │  └───────────┘  │  │  │   子路由出口              │  │ │ │
│  │                  │  │  │   ┌────────────────────┐  │  │ │
│  │                  │  │  │   │ Dashboard          │  │  │ │
│  │                  │  │  │   │ ApiDocsView        │  │  │ │
│  │                  │  │  │   │ Forbidden          │  │  │ │
│  │                  │  │  │   └────────────────────┘  │  │ │
│  │                  │  │  └──────────────────────────┘  │ │ │
│  │                  │  └────────────────────────────────┘  │ │
│  │                  └──────────────────────────────────────┘ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### 路由映射关系

| 路径 | 布局 | 页面组件 | 说明 |
|------|------|----------|------|
| \`/login\` | 无 | Login.vue | 独立登录页 |
| \`/\` | Layout | → 重定向 /dashboard | 根路径重定向 |
| \`/dashboard\` | Layout | Dashboard.vue | 首页工作台 |
| \`/api-docs\` | Layout | ApiDocsView.vue | 接口文档页 |
| \`/forbidden\` | Layout | Forbidden.vue | 403 权限不足 |
| \`/*\` (无效路径) | 无 | NotFound.vue | 404 页面兜底 |

## 🌐 API 接口文档

### 模拟接口列表

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | \`/api/health\` | 健康检查，返回服务状态和种子信息 |
| POST | \`/api/mock/reset\` | 重置模拟数据为固定种子 2026 |
| GET | \`/api/mock/error\` | 模拟 500 服务器错误 |

所有接口响应统一格式：

\`\`\`json
{
  "code": 0,
  "message": "操作成功",
  "data": {}
}
\`\`\`

> 💡 访问 \`/api-docs\` 可在线调试所有接口

### 客户管理模块接口清单（规划）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | \`/api/customers\` | 获取客户列表（支持分页、搜索） |
| POST | \`/api/customers\` | 新增客户 |
| GET | \`/api/customers/:id\` | 获取客户详情 |
| PUT | \`/api/customers/:id\` | 更新客户信息 |
| DELETE | \`/api/customers/:id\` | 删除客户 |

**GET /api/customers 请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页条数，默认 10 |
| keyword | string | 否 | 搜索关键词 |
| role | string | 否 | 角色筛选 |

**响应示例**

\`\`\`json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "list": [
      { "id": 1, "name": "张三", "phone": "13800138001", "role": "管理员" }
    ],
    "total": 5
  }
}
\`\`\`

## 🔧 常见问题

### 1. 端口被占用
Vite 会自动切换到下一个可用端口（如 3001），无需手动处理。

### 2. MSW 未启动
- 检查 \`public/mockServiceWorker.js\` 是否存在
- 运行 \`npx msw init public/ --save\` 重新生成
- 确认 \`main.js\` 中正确启动 MSW

### 3. 页面空白
- 检查 \`router/index.js\` 是否正确导出 \`export default router\`
- 检查 \`App.vue\` 是否包含 \`<router-view />\`
- 检查 \`vite.config.js\` 中路径别名 \`@\` 是否配置正确

### 4. 请求返回 404
- 检查 \`handlers/index.js\` 中的路径是否与 \`request.js\` 的 \`baseURL\` 拼接后一致
- 确认 \`request.js\` 中 \`baseURL: '/api'\`
- 检查 MSW 是否成功启动（终端有 \`[MSW]\` 日志）

## 👥 开发团队

- 前端开发：NexusCRM 团队

## 📄 许可证

MIT License

---

**NexusCRM - 企业级客户关系管理系统**
`;

// 创建并自动下载
const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'README.md';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
console.log('✅ README.md 已开始下载！');
## 🌐 API 接口文档

### 客户管理模块接口清单

#### 1. GET /api/customers - 获取客户列表

**请求参数 (Query)**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页条数，默认 10 |
| keyword | string | 否 | 搜索关键词（姓名/电话） |
| role | string | 否 | 角色筛选（管理员/编辑/访客） |

**响应示例**

```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "list": [
      { "id": 1, "name": "张三", "phone": "13800138001", "role": "管理员", "email": "zhangsan@example.com", "createdAt": "2026-01-15T08:30:00.000Z" }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10
  }
}
{
  "name": "李四",
  "phone": "13800138002",
  "role": "编辑",
  "email": "lisi@example.com"
}
{
  "code": 0,
  "message": "客户创建成功",
  "data": {
    "id": 6,
    "name": "李四",
    "phone": "13800138002",
    "role": "编辑",
    "email": "lisi@example.com",
    "createdAt": "2026-06-22T08:30:00.000Z"
  }
}
3. GET /api/customers/:id - 获取客户详情
路径参数

参数	类型	必填	说明
id	number	是	客户ID
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 1,
    "name": "张三",
    "phone": "13800138001",
    "role": "管理员",
    "email": "zhangsan@example.com",
    "createdAt": "2026-01-15T08:30:00.000Z"
  }
}
4. PUT /api/customers/:id - 更新客户信息
路径参数

参数	类型	必填	说明
id	number	是	客户ID
{
  "name": "张三丰",
  "phone": "13800138001",
  "role": "管理员",
  "email": "zhangsf@example.com"
}
{
  "code": 0,
  "message": "客户信息更新成功",
  "data": {
    "id": 1,
    "name": "张三丰",
    "phone": "13800138001",
    "role": "管理员",
    "email": "zhangsf@example.com",
    "updatedAt": "2026-06-22T09:00:00.000Z"
  }
}
5. DELETE /api/customers/:id - 删除客户
路径参数

参数	类型	必填	说明
id	number	是	客户ID
{
  "code": 0,
  "message": "客户删除成功",
  "data": null
}
常见错误码：

code	说明
0	成功
-1	通用错误
404	资源不存在
403	无权限操作
400	请求参数错误