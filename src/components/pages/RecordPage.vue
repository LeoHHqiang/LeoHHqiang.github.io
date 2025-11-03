<template>
  <main class="main-content">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <h2 class="page-title">{{ pageName }}</h2>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-secondary" @click="onExport" :disabled="loading">
          导出记录
        </button>
        <button class="btn btn-ghost" @click="onRefresh" :disabled="refreshing">
          手动刷新
        </button>
      </div>
    </div>

    <!-- 筛选卡片 -->
    <div class="filters-card">
      <div class="filters-grid">
        <div class="form-item">
          <label class="label">操作日期：</label>
          <input class="input" v-model="form.date" placeholder="请输入" />
        </div>
        <div class="form-item">
          <label class="label">操作角色：</label>
          <select class="select" v-model="form.role">
            <option value="">请选择</option>
            <option v-for="r in roleOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
          </select>
        </div>
        <div class="form-item">
          <label class="label">操作类型：</label>
          <select class="select" v-model="form.type">
            <option value="">请选择</option>
            <option v-for="t in typeOptions" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div class="form-item">
          <label class="label">关联项目：</label>
          <input class="input" v-model="form.project" placeholder="请输入" />
        </div>
      </div>
      <div class="filters-actions">
        <button class="btn btn-primary" @click="onQuery" :disabled="loading">查询</button>
        <button class="btn btn-ghost" @click="onReset" :disabled="loading">重置</button>
      </div>
    </div>

    <!-- 结果表格 -->
    <div class="card">
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 160px">时间</th>
              <th style="width: 120px">操作人</th>
              <th style="width: 120px">角色</th>
              <th style="width: 140px">类型</th>
              <th style="width: 200px">关联项目</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="center">加载中...</td>
            </tr>
            <tr v-else-if="records.length === 0">
              <td colspan="6" class="center empty">暂无数据</td>
            </tr>
            <tr v-else v-for="rec in records" :key="rec.id">
              <td>{{ rec.time }}</td>
              <td>{{ rec.userName }}</td>
              <td>{{ rec.role }}</td>
              <td>{{ rec.type }}</td>
              <td>{{ rec.project || '-' }}</td>
              <td>{{ rec.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <button class="page-btn" :disabled="page === 1 || loading" @click="goPage(page - 1)">上一页</button>
        <span class="page-info">第 {{ page }} / {{ totalPages }} 页</span>
        <button class="page-btn" :disabled="page === totalPages || loading" @click="goPage(page + 1)">下一页</button>
      </div>
    </div>
  </main>
</template>

<script setup>
/* eslint-disable */
import { reactive, ref, computed, onMounted } from 'vue'
import { fetchOperationRecords, exportOperationRecords, refreshOperationRecords } from '@/api'

const props = defineProps({
  pageName: {
    type: String,
    default: '操作记录'
  }
})

const form = reactive({
  date: '',
  role: '',
  type: '',
  project: ''
})

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '审核员', value: 'auditor' },
  { label: '成员', value: 'member' }
]

const typeOptions = [
  { label: '创建', value: 'create' },
  { label: '修改', value: 'update' },
  { label: '删除', value: 'delete' },
  { label: '导入/导出', value: 'transfer' }
]

const records = ref([])
const loading = ref(false)
const refreshing = ref(false)
const page = ref(1)
const size = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size.value)))

const buildQuery = () => ({
  page: page.value,
  size: size.value,
  date: form.date || undefined,
  role: form.role || undefined,
  type: form.type || undefined,
  project: form.project || undefined
})

const loadData = async () => {
  loading.value = true
  try {
    // 预期后端返回 { success, data: { list: [], total } }
    const res = await fetchOperationRecords(buildQuery())
    if (res && res.data) {
      records.value = res.data.list || []
      total.value = Number(res.data.total || 0)
    } else {
      // 本地占位数据，方便前端联调前演示
      records.value = [
        { id: 'd1', time: '2025-01-01 10:00:00', userName: '张三', role: 'admin', type: 'create', project: 'P-001', description: '新增项目 P-001' },
        { id: 'd2', time: '2025-01-02 11:20:00', userName: '李四', role: 'member', type: 'update', project: 'P-002', description: '更新里程碑' }
      ]
      total.value = 2
    }
  } finally {
    loading.value = false
  }
}

const onQuery = async () => {
  page.value = 1
  await loadData()
}

const onReset = async () => {
  form.date = ''
  form.role = ''
  form.type = ''
  form.project = ''
  await onQuery()
}

const goPage = async (p) => {
  page.value = Math.min(Math.max(1, p), totalPages.value)
  await loadData()
}

const onExport = async () => {
  const res = await exportOperationRecords(buildQuery())
  if (res && res.url) {
    window.open(res.url)
    return
  }
  if (res && res.blob) {
    const url = URL.createObjectURL(res.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '操作记录.xlsx'
    a.click()
    URL.revokeObjectURL(url)
  }
}

const onRefresh = async () => {
  try {
    refreshing.value = true
    await refreshOperationRecords()
    await loadData()
  } finally {
    refreshing.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.main-content {
  padding: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.btn {
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background: #fff;
  cursor: pointer;
}
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary { background: #3a7afe; color: #fff; border-color: #3a7afe; }
.btn-secondary { background: #eff5ff; color: #2f6bff; border-color: #c9dcff; }
.btn-ghost { background: #fff; color: #2f6bff; border-color: #c9dcff; }

.filters-card {
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px 16px;
}

.form-item { display: flex; align-items: center; }
.label { width: 80px; color: #606266; }
.input, .select {
  flex: 1;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
}

.filters-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.card {
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 8px;
}

.table-wrapper { overflow: auto; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { border-bottom: 1px solid #f0f0f0; padding: 10px 12px; text-align: left; }
.table thead th { background: #fafbfc; color: #606266; font-weight: 600; }
.center { text-align: center; }
.empty { color: #999; }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 12px;
}
.page-btn { padding: 6px 12px; border-radius: 6px; border: 1px solid #dcdfe6; background: #fff; cursor: pointer; }
.page-btn:disabled { opacity: .6; cursor: not-allowed; }
.page-info { color: #606266; }

@media (max-width: 1200px) {
  .filters-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>


