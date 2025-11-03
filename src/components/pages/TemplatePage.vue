<template>
  <main class="main-content">
    <!-- 顶部搜索与操作 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <label class="label">模板创建人：</label>
        <input class="search-input" v-model="filters.creator" placeholder="请输入" />
        <button class="btn btn-primary" @click="onQuery">查询</button>
        <button class="btn btn-ghost" @click="onReset">重置</button>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-secondary" @click="onCreate">+ 新建验收模版</button>
      </div>
    </div>

    <!-- 模板卡片栅格 -->
    <div class="grid">
      <div v-for="tpl in pagedTemplates" :key="tpl.id" class="card">
        <div class="card-header">{{ tpl.name }}</div>
        <div class="card-meta">
          <span>创建人：{{ tpl.creator }}</span>
          <span>创建时间：{{ tpl.createdAt }}</span>
        </div>
        <div class="card-actions">
          <button class="btn-sm btn-outline" @click="onEdit(tpl)">编辑</button>
          <button class="btn-sm btn-outline" @click="onDuplicate(tpl)">复用</button>
          <button class="btn-sm btn-danger" @click="requestDelete(tpl)">删除</button>
        </div>
      </div>
    </div>

    <!-- 分页（含跳转） -->
    <div class="pager">
      <div class="pager-left">共 {{ total }} 条记录， 共 {{ totalPages }} 页</div>
      <div class="pager-right">
        <button class="page-btn" :disabled="page===1" @click="goPage(1)">≪</button>
        <button class="page-btn" :disabled="page===1" @click="goPage(page-1)">‹</button>
        <span class="page-num" :class="{active: page===p}" v-for="p in pageList" :key="p" @click="goPage(p)">{{ p }}</span>
        <button class="page-btn" :disabled="page===totalPages" @click="goPage(page+1)">›</button>
        <button class="page-btn" :disabled="page===totalPages" @click="goPage(totalPages)">≫</button>
        <span class="jump">跳转到</span>
        <input class="jump-input" v-model.number="jumpTo" @keyup.enter="goPage(jumpTo)" />
        <span>页</span>
      </div>
    </div>
    
    <!-- 删除确认弹窗 -->
    <div v-if="confirm.visible" class="modal-mask" @click.self="closeConfirm">
      <div class="modal">
        <div class="modal-header">
          <span>提示</span>
          <button class="icon-btn" @click="closeConfirm">✕</button>
        </div>
        <div class="modal-body">
          <div class="warn-icon">!</div>
          <div class="modal-text">
            <div class="title">请注意，此为危险操作，</div>
            <div class="desc">确定删除 <span class="link">{{ confirm.target?.name }}</span> 模板吗？</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="confirmDelete">确认</button>
          <button class="btn" @click="closeConfirm">取消</button>
        </div>
      </div>
    </div>
  </main>
  
</template>

<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, ref } from 'vue'
import { fetchTemplates, deleteTemplate, duplicateTemplate } from '@/api'

const props = defineProps({
  pageName: { type: String, default: '模板管理' }
})

const filters = reactive({ creator: '' })

// 本地模板数据（未接后端时展示）
const allTemplates = ref([])
const page = ref(1)
const size = ref(8)
const total = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size.value)))
const pageList = computed(() => {
  const max = totalPages.value
  const current = page.value
  const around = [current-1, current, current+1].filter(p => p>=1 && p<=max)
  return Array.from(new Set([1, ...around, max])).sort((a,b)=>a-b)
})
const pagedTemplates = computed(() => {
  const start = (page.value - 1) * size.value
  return allTemplates.value.slice(start, start + size.value)
})
const jumpTo = ref()

const loadData = async () => {
  // 预留：尝试拉取后端数据
  const res = await fetchTemplates({ creator: filters.creator, page: 1, size: 999 })
  if (res && res.data && Array.isArray(res.data.list)) {
    allTemplates.value = res.data.list
    total.value = Number(res.data.total || res.data.list.length)
  } else {
    // 本地演示数据
    allTemplates.value = [
      { id: 't1', name: '吉利1', creator: '张三', createdAt: '2025.01.01' },
      { id: 't2', name: '吉利2', creator: '李四', createdAt: '2025.01.01' },
      { id: 't3', name: '理想1', creator: '王五', createdAt: '2025.01.01' },
      { id: 't4', name: '理想2', creator: '赵六', createdAt: '2025.01.01' },
      { id: 't5', name: '宝马1', creator: '张三', createdAt: '2025.01.01' },
      { id: 't6', name: '宝马2', creator: '张三', createdAt: '2025.01.01' },
      { id: 't7', name: '比亚迪1', creator: '周七', createdAt: '2025.01.01' },
      { id: 't8', name: '比亚迪2', creator: '周七', createdAt: '2025.01.01' },
      { id: 't9', name: '特斯拉1', creator: '钱八', createdAt: '2025.01.01' },
      { id: 't10', name: '特斯拉2', creator: '钱八', createdAt: '2025.01.01' }
    ]
    total.value = allTemplates.value.length
  }
}

const onQuery = async () => {
  page.value = 1
  if (filters.creator) {
    allTemplates.value = allTemplates.value.filter(t => t.creator.includes(filters.creator))
    total.value = allTemplates.value.length
  } else {
    await loadData()
  }
}

const onReset = async () => {
  filters.creator = ''
  await loadData()
}

const goPage = (p) => {
  const max = totalPages.value
  const next = Math.min(Math.max(1, Number(p) || 1), max)
  page.value = next
}

// 预留页面跳转（未有路由时仅提示，可在集成路由后替换为 router.push）
const goToEditor = (mode, id) => {
  // 示例：router.push({ name: 'TemplateEditor', query: { mode, id } })
  window.alert(`跳转到模板编辑页：mode=${mode}${id ? ', id='+id : ''}`)
}
const onCreate = () => goToEditor('create')
const onEdit = (tpl) => goToEditor('edit', tpl.id)
const onDuplicate = async (tpl) => {
  // 预留后端复用接口
  await duplicateTemplate(tpl.id).catch(()=>{})
  goToEditor('duplicate', tpl.id)
}

// 删除确认弹窗
const confirm = reactive({ visible: false, target: null })
const requestDelete = (tpl) => { confirm.visible = true; confirm.target = tpl }
const closeConfirm = () => { confirm.visible = false; confirm.target = null }
const confirmDelete = async () => {
  const tpl = confirm.target
  if (!tpl) return closeConfirm()
  await deleteTemplate(tpl.id).catch(()=>{})
  allTemplates.value = allTemplates.value.filter(t => t.id !== tpl.id)
  total.value = allTemplates.value.length
  if (page.value > totalPages.value) page.value = totalPages.value
  closeConfirm()
}

onMounted(loadData)
</script>

<style scoped>
.main-content { padding: 16px; display: flex; flex-direction: column; min-height: 100vh; box-sizing: border-box; }

.toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.toolbar-left { display: flex; align-items: center; gap: 8px; }
.label { color: #606266; }
.search-input { width: 220px; height: 32px; padding: 0 8px; border: 1px solid #dcdfe6; border-radius: 6px; }

.btn { height: 32px; padding: 0 12px; border-radius: 6px; border: 1px solid #dcdfe6; background: #fff; cursor: pointer; }
.btn-primary { background: #3a7afe; color: #fff; border-color: #3a7afe; }
.btn-ghost { background: #fff; color: #2f6bff; border-color: #c9dcff; }
.btn-secondary { background: #eff5ff; color: #2f6bff; border-color: #c9dcff; }

.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.card { background: #fff; border: 1px solid #eef0f3; border-radius: 10px; padding: 12px; }
.card-header { font-weight: 600; margin-bottom: 8px; }
.card-meta { color: #606266; font-size: 12px; display: flex; justify-content: space-between; margin-bottom: 10px; }
.card-actions { display: flex; gap: 8px; }
.btn-sm { height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid #c9dcff; background: #fff; color: #2f6bff; cursor: pointer; }
.btn-danger { border-color: #ffcccc; color: #ff4d4f; }

.pager { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 16px; color: #606266; }
.pager-right { display: flex; align-items: center; gap: 6px; }
.page-btn { padding: 4px 8px; border: 1px solid #dcdfe6; background: #fff; border-radius: 4px; cursor: pointer; }
.page-num { padding: 4px 8px; border: 1px solid #dcdfe6; border-radius: 4px; cursor: pointer; }
.page-num.active { background: #3a7afe; color: #fff; border-color: #3a7afe; }
.jump { margin-left: 8px; }
.jump-input { width: 48px; height: 26px; padding: 0 6px; border: 1px solid #dcdfe6; border-radius: 4px; }

/* 弹窗样式 */
.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,.35); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { width: 520px; background: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.12); overflow: hidden; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; font-weight: 600; border-bottom: 1px solid #f0f0f0; }
.icon-btn { border: none; background: transparent; cursor: pointer; font-size: 16px; }
.modal-body { display: flex; align-items: center; gap: 16px; padding: 24px 24px 8px; }
.warn-icon { width: 56px; height: 56px; border-radius: 50%; background: #ffecb3; color: #faad14; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 28px; }
.modal-text .title { font-weight: 600; margin-bottom: 6px; }
.modal-text .desc { color: #606266; }
.modal-text .link { color: #2f6bff; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 16px 24px 24px; }

@media (max-width: 1200px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
</style>


