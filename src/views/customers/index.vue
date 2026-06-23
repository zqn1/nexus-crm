<template>
  <div class="customer-page">
    <div class="page-header">
      <h2>👥 客户管理</h2>
      <el-button
        type="primary"
        @click="handleAdd"
        v-if="userStore.hasPermission('customer:create')"
      >
        <el-icon><Plus /></el-icon> 新增客户
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="姓名/电话/邮箱"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" clearable placeholder="全部角色">
            <el-option label="VIP" value="VIP" />
            <el-option label="普通" value="普通" />
            <el-option label="潜在客户" value="潜在客户" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="姓名" min-width="100" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="company" label="公司" min-width="140" />
        <el-table-column prop="role" label="角色" min-width="100">
          <template #default="{ row }">
            <el-tag :type="roleTagType(row.role)" size="small">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="170">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              link
              v-if="userStore.hasPermission('customer:edit')"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              v-if="userStore.hasPermission('customer:delete')"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
            <el-button
              type="info"
              size="small"
              link
              v-if="!userStore.hasPermission('customer:edit') && !userStore.hasPermission('customer:delete')"
              disabled
            >
              无权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchData"
          @current-change="fetchData"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <CustomerForm
      v-model:visible="formVisible"
      :data="formData"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getCustomerList, deleteCustomer } from '@/api/mock'
import { useUserStore } from '@/stores/user'
import CustomerForm from './form.vue'

export default {
  name: 'CustomerIndex',
  components: { CustomerForm, Plus },
  setup() {
    const userStore = useUserStore()
    const tableData = ref([])
    const loading = ref(false)

    const searchForm = reactive({
      keyword: '',
      role: '',
    })

    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
    })

    const formVisible = ref(false)
    const formData = ref(null)

    const fetchData = async () => {
      loading.value = true
      try {
        const res = await getCustomerList({
          page: pagination.page,
          pageSize: pagination.pageSize,
          keyword: searchForm.keyword,
          role: searchForm.role,
        })
        tableData.value = res.data.list || []
        pagination.total = res.data.total || 0
      } catch (error) {
        ElMessage.error('获取数据失败')
        console.error(error)
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      pagination.page = 1
      fetchData()
    }

    const handleReset = () => {
      searchForm.keyword = ''
      searchForm.role = ''
      pagination.page = 1
      fetchData()
    }

    const handleAdd = () => {
      formData.value = null
      formVisible.value = true
    }

    const handleEdit = (row) => {
      formData.value = { ...row }
      formVisible.value = true
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm(`确定要删除客户「${row.name}」吗？`, '提示', {
        type: 'warning',
      }).then(async () => {
        try {
          await deleteCustomer(row.id)
          ElMessage.success('删除成功')
          fetchData()
        } catch (error) {
          ElMessage.error('删除失败')
        }
      })
    }

    const handleFormSuccess = () => {
      formVisible.value = false
      fetchData()
    }

    const roleTagType = (role) => {
      const map = {
        VIP: 'success',
        普通: 'info',
        潜在客户: 'warning',
      }
      return map[role] || 'info'
    }

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

    onMounted(fetchData)

    return {
      userStore,
      tableData,
      loading,
      searchForm,
      pagination,
      formVisible,
      formData,
      fetchData,
      handleSearch,
      handleReset,
      handleAdd,
      handleEdit,
      handleDelete,
      handleFormSuccess,
      roleTagType,
      formatDate,
    }
  },
}
</script>

<style scoped lang="scss">
.customer-page {
  padding: 0;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    h2 {
      margin: 0;
    }
  }

  .search-card {
    margin-bottom: 20px;
    :deep(.el-card__body) {
      padding: 20px 20px 4px;
    }
  }

  .table-card {
    .pagination-wrapper {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>