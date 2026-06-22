<template>
  <div class="page-error">
    <h1>403</h1>
    <p>抱歉，您没有权限访问此页面。</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Forbidden',
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
    color: #f56c6c;
    margin-bottom: 20px;
  }
  p {
    font-size: 18px;
    color: #606266;
    margin-bottom: 30px;
  }
}
</style>