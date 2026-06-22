<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Breadcrumb',
  setup() {
    const route = useRoute()
    const currentTitle = computed(() => route.meta?.title || '')
    return { currentTitle }
  },
}
</script>

<style scoped lang="scss">
.breadcrumb {
  padding: 0 0 12px 0;
  font-size: 14px;
}
</style>