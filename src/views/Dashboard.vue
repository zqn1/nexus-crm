<template>
  <div class="dashboard">
    <h2>📊 首页工作台</h2>
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
    <el-card style="margin-top:20px;">
      <p>欢迎使用 NexusCRM 后台，这里展示经营指标概览。</p>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      stats: [
        { title: '今日订单', value: '1,286' },
        { title: '总用户数', value: '8,942' },
        { title: '新增客户', value: '156' },
        { title: '成交金额', value: '¥3.2M' },
      ],
    }
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
}
</style>