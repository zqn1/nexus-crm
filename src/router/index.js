import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Layout.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', public: true },
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/Forbidden.vue'),
    meta: { title: '403 权限不足', public: true },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '首页工作台' },
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('@/views/customers/index.vue'),
        meta: {
          title: '客户管理',
          roles: ['admin', 'manager', 'sales', 'support'],
        },
      },
      {
        path: 'opportunities',
        name: 'Opportunities',
        component: () => import('@/views/common/ModulePlaceholderView.vue'),
        meta: {
          title: '商机管理',
          roles: ['admin', 'manager', 'sales'],
          placeholder: {
            icon: 'TrendCharts',
            title: '商机管理',
            description: '管理销售机会和跟进记录',
          },
        },
      },
      {
        path: 'contracts',
        name: 'Contracts',
        component: () => import('@/views/common/ModulePlaceholderView.vue'),
        meta: {
          title: '合同管理',
          roles: ['admin', 'manager'],
          placeholder: {
            icon: 'DocumentCopy',
            title: '合同管理',
            description: '管理客户合同和审批流程',
          },
        },
      },
      {
        path: 'tickets',
        name: 'Tickets',
        component: () => import('@/views/common/ModulePlaceholderView.vue'),
        meta: {
          title: '工单中心',
          roles: ['admin', 'support'],
          placeholder: {
            icon: 'Tickets',
            title: '工单中心',
            description: '处理客户服务工单',
          },
        },
      },
      {
        path: 'api-docs',
        name: 'ApiDocs',
        component: () => import('@/views/api-docs/ApiDocsView.vue'),
        meta: {
          title: '接口文档',
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404 页面不存在', public: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ==================== 全局路由守卫 ====================
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 公开页面直接放行
  if (to.meta.public) {
    return next()
  }

  // 已登录访问登录页 → 跳转工作台
  if (to.name === 'Login' && userStore.isLoggedIn) {
    return next('/dashboard')
  }

  // 需要登录的页面
  if (to.meta.requiresAuth !== false) {
    if (!userStore.isLoggedIn) {
      const restored = await userStore.restoreSession()
      if (!restored) {
        return next({
          path: '/login',
          query: { redirect: to.fullPath },
        })
      }
    }

    if (!userStore.isLoggedIn) {
      return next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    }

    // 检查角色权限
    if (to.meta.roles && to.meta.roles.length > 0) {
      const userRole = userStore.userInfo?.role
      if (!userRole || !to.meta.roles.includes(userRole)) {
        return next('/forbidden')
      }
    }
  }

  next()
})

export default router