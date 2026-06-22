<template>
  <div class="page-error">
    <h1>404</h1>
    <p>哎呀，页面找不到了。</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter()
    const goHome = () => router.push('/dashboard')
    return { goHome }
  },
}
</script>

<style scoped lang="scss">
.page-error {
  text-align: center;
  padding: 80px 0;
  h1 {
    font-size: 72px;
    color: #909399;
    margin-bottom: 20px;
  }
  p {
    font-size: 18px;
    color: #606266;
    margin-bottom: 30px;
  }
}
</style>