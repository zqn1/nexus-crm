<template>
  <div class="module-placeholder">
    <div class="placeholder-icon">
      <el-icon :size="64"><Component :is="icon" /></el-icon>
    </div>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <el-tag type="info">该模块正在开发中，敬请期待</el-tag>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'ModulePlaceholderView',
  props: {
    icon: {
      type: String,
      default: 'Document',
    },
    title: {
      type: String,
      default: '模块名称',
    },
    description: {
      type: String,
      default: '该功能模块正在开发中...',
    },
  },
  setup(props) {
    const route = useRoute()
    const pageTitle = computed(() => route.meta?.title || props.title)
    return { pageTitle }
  },
}
</script>

<style scoped lang="scss">
.module-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 40px;

  .placeholder-icon {
    margin-bottom: 24px;
    color: #909399;
  }

  h2 {
    font-size: 28px;
    color: #303133;
    margin-bottom: 12px;
  }

  p {
    font-size: 16px;
    color: #909399;
    margin-bottom: 24px;
  }
}
</style>