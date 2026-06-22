<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑客户' : '新增客户'"
    width="500px"
    @close="handleClose"
    @update:model-value="emit('update:visible', $event)"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      status-icon
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入客户姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱（选填）" />
      </el-form-item>
      <el-form-item label="公司" prop="company">
        <el-input v-model="form.company" placeholder="请输入公司名称（选填）" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" placeholder="请选择角色" style="width:100%">
          <el-option label="VIP" value="VIP" />
          <el-option label="普通" value="普通" />
          <el-option label="潜在客户" value="潜在客户" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { addCustomer, updateCustomer } from '@/api/mock'

export default {
  name: 'CustomerForm',
  props: {
    visible: Boolean,
    data: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:visible', 'success'],
  setup(props, { emit }) {
    const formRef = ref(null)
    const submitting = ref(false)

    const isEdit = computed(() => !!props.data?.id)

    const defaultForm = {
      name: '',
      phone: '',
      email: '',
      company: '',
      role: '普通',
    }

    const form = reactive({ ...defaultForm })

    // 校验规则
    const rules = {
      name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1\d{10}$/, message: '请输入正确的手机号（11位）', trigger: 'blur' },
      ],
      role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    }

    // 监听 data 变化，填充表单
    watch(
      () => props.data,
      (val) => {
        if (val) {
          Object.assign(form, val)
        } else {
          Object.assign(form, defaultForm)
        }
      },
      { immediate: true }
    )

    const handleClose = () => {
      emit('update:visible', false)
      formRef.value?.resetFields()
    }

    const handleSubmit = async () => {
      try {
        await formRef.value?.validate()
        submitting.value = true

        const submitData = {
          name: form.name,
          phone: form.phone,
          email: form.email || '',
          company: form.company || '',
          role: form.role,
        }

        if (isEdit.value) {
          await updateCustomer(form.id, submitData)
          ElMessage.success('客户信息已更新')
        } else {
          await addCustomer(submitData)
          ElMessage.success('客户已创建')
        }

        emit('success')
      } catch (error) {
        if (error?.response?.data?.message) {
          ElMessage.error(error.response.data.message)
        } else if (error !== false) {
          ElMessage.error('操作失败，请重试')
        }
      } finally {
        submitting.value = false
      }
    }

    return {
      formRef,
      form,
      rules,
      isEdit,
      submitting,
      handleClose,
      handleSubmit,
    }
  },
}
</script>