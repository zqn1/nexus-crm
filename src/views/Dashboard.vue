<template>
  <div class="dashboard">
    <h2>📊 首页工作台</h2>

    <!-- 统计卡片 -->
    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="6" v-for="item in stats" :key="item.title">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-title">{{ item.title }}</div>
            <div class="stat-value">{{ item.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 权限按钮示例 -->
    <el-card style="margin-top:20px;">
      <template #header>
        <span>操作面板（按钮权限示例）</span>
      </template>
      <div class="action-buttons">
        <el-button
          type="primary"
          v-if="userStore.hasPermission('customer:create')"
          @click="handleAction('新建客户')"
        >
          <el-icon><Plus /></el-icon> 新建客户
        </el-button>

        <el-button
          type="success"
          v-if="userStore.hasPermission('opportunity:create')"
          @click="handleAction('新建商机')"
        >
          <el-icon><TrendCharts /></el-icon> 新建商机
        </el-button>

        <el-button
          type="warning"
          v-if="userStore.hasPermission('contract:approve')"
          @click="handleAction('审批合同')"
        >
          <el-icon><DocumentChecked /></el-icon> 审批合同
        </el-button>

        <el-button
          type="danger"
          v-if="userStore.hasPermission('ticket:handle')"
          @click="handleAction('处理工单')"
        >
          <el-icon><Tickets /></el-icon> 处理工单
        </el-button>

        <el-button
          type="info"
          v-if="userStore.hasPermission('api-docs:view')"
          @click="handleAction('查看接口文档')"
        >
          <el-icon><Document /></el-icon> 查看接口文档
        </el-button>
      </div>
      <div class="permission-info">
        <el-tag size="small" type="info">
          当前角色：{{ userStore.userInfo?.roleName || '未知' }}
        </el-tag>
        <el-tag size="small" type="success" style="margin-left:8px;">
          权限数：{{ userStore.permissions?.length || 0 }}
        </el-tag>
      </div>
    </el-card>

    <el-card style="margin-top:20px;">
      <p>欢迎使用 NexusCRM 后台，这里展示经营指标概览。</p>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { Plus, TrendCharts, DocumentChecked, Tickets, Document } from '@element-plus/icons-vue'

export default {
  name: 'DashboardView',
  components: { Plus, TrendCharts, DocumentChecked, Tickets, Document },
  setup() {
    const userStore = useUserStore()

    const stats = ref([
      { title: '今日订单', value: '1,286' },
      { title: '总用户数', value: '8,942' },
      { title: '新增客户', value: '156' },
      { title: '成交金额', value: '¥3.2M' },
    ])

    const handleAction = (name) => {
      ElMessage.success(`已执行操作：${name}`)
    }

    return { userStore, stats, handleAction }
  },
}
</script>

<style scoped lang="scss">
.dashboard {
  .stat-item {
    text-align: center;
    .stat-title {
      color: #909399;
      font-size: 14px;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
      margin-top: 8px;
    }
  }

  .action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .permission-info {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e4e7ed;
  }
}
</style>