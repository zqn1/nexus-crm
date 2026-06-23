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
          :disabled="item.disabled || false"
        >
          <el-icon><component :is="item.icon || 'House'" /></el-icon>
          <template #title>
            {{ collapsed ? (item.shortLabel || item.title) : item.title }}
            <el-badge
              v-if="item.badge"
              :value="item.badge"
              class="menu-badge"
            />
          </template>
        </el-menu-item>
      </template>
    </el-menu>
    <div class="sidebar-footer" v-if="!collapsed">
      <el-tag size="small" type="info">
        可访问 {{ menuItems.length }} 个模块
      </el-tag>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default {
  name: 'Sidebar',
  props: {
    collapsed: Boolean,
  },
  setup() {
    const route = useRoute()
    const userStore = useUserStore()

    // 从 userStore 获取动态菜单
    const menuItems = computed(() => userStore.routes || [])

    const activePath = computed(() => route.path)

    return { menuItems, activePath }
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

    .logo span {
      display: none;
    }

    .sidebar-footer {
      display: none;
    }
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

    span {
      transition: opacity 0.3s ease;
    }
  }

  .sidebar-menu {
    flex: 1;
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

      .menu-badge {
        margin-left: 8px;
      }
    }
  }

  .sidebar-footer {
    padding: 16px;
    text-align: center;
    border-top: 1px solid #1f2d3d;
  }
}
</style>