<template>
  <header class="header-bar">
    <div class="left">
      <el-button text @click="toggleSidebar" class="fold-btn">
        <el-icon><Expand v-if="collapsed" /><Fold v-else /></el-icon>
      </el-button>
      <span class="system-title">NexusCRM 后台</span>
    </div>
    <div class="right">
      <el-tag size="small" type="info">开发环境</el-tag>
      <span class="user-info"><el-icon><User /></el-icon> 管理员</span>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/stores'

export default {
  name: 'HeaderBar',
  setup() {
    const store = useAppStore()
    const collapsed = computed(() => store.sidebarCollapsed)
    const toggleSidebar = () => store.toggleSidebar()
    return { collapsed, toggleSidebar }
  },
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.header-bar {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;

  .left {
    display: flex;
    align-items: center;
    .fold-btn {
      font-size: 20px;
      margin-right: 16px;
      cursor: pointer;
    }
    .system-title {
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 16px;
    .user-info {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #606266;
    }
  }
}
</style>