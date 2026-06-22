<template>
  <div class="login-container">
    <div class="login-box">
      <h1>NexusCRM 登录</h1>
      <el-button type="primary" @click="goDashboard">点击登录进入工作台</el-button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const goDashboard = () => {
      router.push('/dashboard')
    }
    return { goDashboard }
  },
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}
.login-box {
  background: #fff;
  padding: 40px 60px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  h1 {
    margin-bottom: 30px;
    color: #303133;
  }
}
</style>