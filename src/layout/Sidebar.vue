<template>
  <div class="sidebar" :class="{ collapsed }">
    <div class="logo">
      <span v-if="!collapsed">NexusCRM</span>
      <span v-else>N</span>
    </div>
    <el-menu
      :collapse="collapsed"
      :collapse-transition="false"
      :default-active="activePath"
      router
      class="sidebar-menu"
    >
      <template v-for="item in menuItems" :key="item.path">
        <el-menu-item
          :index="item.path"
          :disabled="item.disabled"
          v-if="!item.disabled"
        >
          <el-icon><component :is="item.icon || 'House'" /></el-icon>
          <template #title>{{ collapsed ? item.shortLabel : item.label }}</template>
        </el-menu-item>
        <!-- 禁用菜单项（只展示，不可点击） -->
        <el-menu-item
          v-else
          :index="item.path"
          disabled
          style="cursor: not-allowed; opacity: 0.6;"
        >
          <el-icon><component :is="item.icon || 'Lock'" /></el-icon>
          <template #title>{{ collapsed ? item.shortLabel : item.label }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { menuItems } from '@/router/menu'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default {
  name: 'Sidebar',
  props: {
    collapsed: Boolean,
  },
  setup() {
    const route = useRoute()
    const activePath = computed(() => route.path)

    // 注册所有图标（用于动态渲染）
    const icons = ElementPlusIconsVue

    return { menuItems, activePath, icons }
  },
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.sidebar {
  width: 220px;
  height: 100vh;
  background: #304156;
  color: #fff;
  transition: width 0.3s ease;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.collapsed {
    width: 64px;
  }

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    border-bottom: 1px solid #1f2d3d;
    background: #2b3d4e;
  }

  .sidebar-menu {
    border-right: none;
    background: transparent;
    .el-menu-item {
      color: #bfcbd9;
      &.is-active {
        color: #409eff;
        background: #1f2d3d;
      }
      &:hover {
        background: #1f2d3d;
      }
    }
  }
}
</style>