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
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-dropdown">
          <el-avatar :size="32" :src="userInfo?.avatar || ''">
            {{ userInfo?.name?.charAt(0) || 'U' }}
          </el-avatar>
          <span class="user-name">{{ userInfo?.name || '管理员' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>
              <div class="user-info-dropdown">
                <div><strong>姓名：</strong>{{ userInfo?.name || '-' }}</div>
                <div><strong>角色：</strong>{{ userInfo?.roleName || '-' }}</div>
                <div><strong>账号：</strong>{{ userInfo?.username || '-' }}</div>
                <div><strong>上次登录：</strong>{{ userInfo?.lastLoginAt ? formatDate(userInfo.lastLoginAt) : '首次登录' }}</div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Expand, Fold, ArrowDown, SwitchButton, User } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores'
import { useUserStore } from '@/stores/user'

export default {
  name: 'HeaderBar',
  components: { Expand, Fold, ArrowDown, SwitchButton, User },
  setup() {
    const router = useRouter()
    const appStore = useAppStore()
    const userStore = useUserStore()

    const collapsed = computed(() => appStore.sidebarCollapsed)
    const userInfo = computed(() => userStore.userInfo)

    const toggleSidebar = () => appStore.toggleSidebar()

    const formatDate = (dateStr) => {
      if (!dateStr) return '-'
      const d = new Date(dateStr)
      return d.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    const handleCommand = (command) => {
      if (command === 'logout') {
        ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定退出',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            await userStore.logoutAction()
            ElMessage.success('已退出登录')
            router.push('/login')
          })
          .catch(() => {})
      }
    }

    return {
      collapsed,
      toggleSidebar,
      userInfo,
      formatDate,
      handleCommand,
    }
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

    .user-dropdown {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 12px 4px 4px;
      border-radius: 20px;
      transition: background 0.2s;

      &:hover {
        background: #f5f7fa;
      }

      .user-name {
        font-size: 14px;
        color: #303133;
      }
    }
  }
}

.user-info-dropdown {
  padding: 4px 0;
  line-height: 1.8;
  font-size: 14px;
  color: #606266;
  min-width: 200px;

  div {
    padding: 2px 0;
  }
}
</style>