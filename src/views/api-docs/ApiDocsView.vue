<template>
  <div class="api-docs">
    <h2>📖 接口文档</h2>
    <p class="desc">以下为模拟接口列表，点击“发送请求”查看响应。</p>

    <div class="api-list">
      <el-card v-for="api in apiList" :key="api.path" class="api-item">
        <template #header>
          <div class="api-header">
            <el-tag :type="api.method === 'GET' ? 'success' : 'warning'">
              {{ api.method }}
            </el-tag>
            <span class="api-path">{{ api.path }}</span>
            <span class="api-desc">{{ api.desc }}</span>
          </div>
        </template>
        <div class="api-body">
          <!-- 请求参数区域 -->
          <div v-if="api.params && api.params.length" class="params-area">
            <el-divider content-position="left">请求参数</el-divider>
            <el-row :gutter="16">
              <el-col :span="8" v-for="param in api.params" :key="param.name">
                <el-form-item :label="param.name" :required="param.required">
                  <el-input
                    v-model="param.value"
                    :placeholder="param.placeholder || `请输入${param.name}`"
                    size="small"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-else class="params-placeholder">
            <el-text size="small" type="info">该接口无需参数</el-text>
          </div>

          <el-button type="primary" size="small" @click="sendRequest(api)">
            发送请求
          </el-button>

          <!-- 响应结果区域 -->
          <div v-if="api.response" class="response-area">
            <el-divider content-position="left">响应结果</el-divider>
            <div class="response-status">
              状态码：<el-tag :type="api.response.status >= 400 ? 'danger' : 'success'">
                {{ api.response.status }}
              </el-tag>
            </div>
            <pre class="response-json">{{ JSON.stringify(api.response.data, null, 2) }}</pre>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import {
  getMockHealth,
  resetMockData,
  getMockError,
  getCustomerList,
  addCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '@/api/mock'

export default {
  name: 'ApiDocsView',
  setup() {
    const apiList = ref([
      // ===== 原有接口 =====
      {
        method: 'GET',
        path: '/api/health',
        desc: '健康检查（返回服务状态、种子、用户数量）',
        fn: getMockHealth,
        params: [],
        response: null,
      },
      {
        method: 'POST',
        path: '/api/mock/reset',
        desc: '重置模拟数据（恢复固定种子数据）',
        fn: resetMockData,
        params: [],
        response: null,
      },
      {
        method: 'GET',
        path: '/api/mock/error',
        desc: '模拟 500 服务器错误（选做）',
        fn: getMockError,
        params: [],
        response: null,
      },

      // ===== 客户管理接口（任务4新增） =====
      {
        method: 'GET',
        path: '/api/customers',
        desc: '获取客户列表（分页+搜索+筛选）',
        fn: () => {
          const params = {}
          const p = apiList.value.find((a) => a.path === '/api/customers')
          if (p && p.params) {
            p.params.forEach((param) => {
              if (param.value) params[param.name] = param.value
            })
          }
          return getCustomerList(params)
        },
        params: [
          { name: 'page', value: '1', placeholder: '页码', required: false },
          { name: 'pageSize', value: '10', placeholder: '每页条数', required: false },
          { name: 'keyword', value: '', placeholder: '搜索关键词', required: false },
          { name: 'role', value: '', placeholder: 'VIP/普通/潜在客户', required: false },
        ],
        response: null,
      },
      {
        method: 'POST',
        path: '/api/customers',
        desc: '新增客户',
        fn: () => {
          const p = apiList.value.find((a) => a.path === '/api/customers' && a.method === 'POST')
          if (p && p.params) {
            const data = {}
            p.params.forEach((param) => {
              if (param.value) data[param.name] = param.value
            })
            return addCustomer(data)
          }
          return addCustomer({ name: '新客户', phone: '13800138000', role: '普通' })
        },
        params: [
          { name: 'name', value: '新客户', placeholder: '姓名', required: true },
          { name: 'phone', value: '13800138000', placeholder: '手机号', required: true },
          { name: 'role', value: '普通', placeholder: 'VIP/普通/潜在客户', required: true },
          { name: 'email', value: 'test@example.com', placeholder: '邮箱（选填）', required: false },
          { name: 'company', value: '测试公司', placeholder: '公司（选填）', required: false },
        ],
        response: null,
      },
      {
        method: 'GET',
        path: '/api/customers/:id',
        desc: '获取客户详情（固定获取 id=1）',
        fn: () => getCustomerById(1),
        params: [],
        response: null,
      },
      {
        method: 'PUT',
        path: '/api/customers/:id',
        desc: '更新客户信息（固定更新 id=1）',
        fn: () => {
          const p = apiList.value.find((a) => a.path === '/api/customers/:id' && a.method === 'PUT')
          if (p && p.params) {
            const data = {}
            p.params.forEach((param) => {
              if (param.value) data[param.name] = param.value
            })
            return updateCustomer(1, data)
          }
          return updateCustomer(1, { name: '张三丰', phone: '13800138001', role: 'VIP' })
        },
        params: [
          { name: 'name', value: '张三丰', placeholder: '姓名', required: true },
          { name: 'phone', value: '13800138001', placeholder: '手机号', required: true },
          { name: 'role', value: 'VIP', placeholder: 'VIP/普通/潜在客户', required: true },
          { name: 'email', value: 'zhangsf@example.com', placeholder: '邮箱（选填）', required: false },
          { name: 'company', value: '科技公司', placeholder: '公司（选填）', required: false },
        ],
        response: null,
      },
      {
        method: 'DELETE',
        path: '/api/customers/:id',
        desc: '删除客户（固定删除 id=1）',
        fn: () => deleteCustomer(1),
        params: [],
        response: null,
      },
    ])

    const sendRequest = async (api) => {
      try {
        const result = await api.fn()
        api.response = { status: 200, data: result }
      } catch (error) {
        api.response = {
          status: error.code === -1 ? 500 : (error.status || 500),
          data: error,
        }
      }
    }

    return { apiList, sendRequest }
  },
}
</script>

<style scoped lang="scss">
.api-docs {
  padding: 20px;

  .desc {
    color: #909399;
    margin-bottom: 20px;
  }
}

.api-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.api-item {
  .api-header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .api-path {
    font-weight: bold;
    font-family: monospace;
  }

  .api-desc {
    color: #606266;
    font-size: 14px;
  }

  .api-body {
    .params-area {
      margin-bottom: 12px;

      .el-row {
        margin-top: 4px;
      }

      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }

    .params-placeholder {
      margin: 8px 0 12px;
      color: #909399;
      font-size: 13px;
    }

    .response-area {
      margin-top: 16px;

      .response-status {
        margin: 8px 0;
      }

      .response-json {
        background: #f5f7fa;
        padding: 12px;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 13px;
        line-height: 1.5;
        border: 1px solid #e4e7ed;
        margin-top: 4px;
        max-height: 300px;
        overflow-y: auto;
      }
    }
  }
}
</style>