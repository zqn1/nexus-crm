<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <Sidebar :collapsed="sidebarCollapsed" />
    <!-- 主内容区 -->
    <div class="main-wrapper" :style="{ marginLeft: sidebarCollapsed ? '64px' : '220px' }">
      <HeaderBar />
      <div class="content-wrapper">
        <Breadcrumb />
        <div class="app-main">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/stores'
import Sidebar from './Sidebar.vue'
import HeaderBar from './HeaderBar.vue'
import Breadcrumb from './Breadcrumb.vue'

export default {
  name: 'Layout',
  components: { Sidebar, HeaderBar, Breadcrumb },
  setup() {
    const store = useAppStore()
    const sidebarCollapsed = computed(() => store.sidebarCollapsed)
    return { sidebarCollapsed }
  },
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  background-color: #f0f2f5;
}

.content-wrapper {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.app-main {
  margin-top: 16px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  min-height: 400px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
</style>