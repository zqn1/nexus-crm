<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>🚀 NexusCRM</h1>
        <p>企业级客户关系管理系统</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="0"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入账号"
            size="large"
            prefix-icon="User"
            :disabled="loading"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            :disabled="loading"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            style="width:100%"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-tips">
        <p>演示账号：admin / Admin@2026</p>
        <p>其他账号：manager / sales / support / viewer</p>
        <p>密码统一：Admin@2026</p>
      </div>

      <div v-if="errorMessage" class="login-error">
        <el-alert :title="errorMessage" type="error" :closable="false" show-icon />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()

    const formRef = ref(null)
    const loading = ref(false)
    const errorMessage = ref('')

    const form = reactive({
      username: 'admin',
      password: 'Admin@2026',
    })

    const rules = {
      username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    }

    const handleLogin = async () => {
      errorMessage.value = ''

      try {
        await formRef.value?.validate()
      } catch {
        return
      }

      loading.value = true

      try {
        const result = await userStore.loginAction({
          username: form.username,
          password: form.password,
        })

        if (result.success) {
          ElMessage.success('登录成功')
          const redirect = route.query.redirect || '/dashboard'
          router.push(redirect)
        } else {
          errorMessage.value = result.message || '登录失败，请重试'
          form.password = ''
        }
      } catch (error) {
        errorMessage.value = error.message || '登录失败，请检查网络'
        form.password = ''
      } finally {
        loading.value = false
      }
    }

    return {
      formRef,
      form,
      rules,
      loading,
      errorMessage,
      handleLogin,
    }
  },
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: #fff;
  padding: 48px 40px 32px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 420px;
  max-width: 90%;

  .login-header {
    text-align: center;
    margin-bottom: 32px;

    h1 {
      font-size: 32px;
      color: #303133;
      margin-bottom: 4px;
    }

    p {
      color: #909399;
      font-size: 14px;
    }
  }

  .login-tips {
    margin-top: 20px;
    padding: 12px 16px;
    background: #f5f7fa;
    border-radius: 8px;
    font-size: 13px;
    color: #606266;
    line-height: 1.8;

    p {
      margin: 0;
    }
  }

  .login-error {
    margin-top: 16px;
  }
}
</style>