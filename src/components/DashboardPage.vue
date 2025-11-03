<template>
  <div class="dashboard-container">
    <!-- Left Sidebar -->
    <SideBar :active-menu="activeMenu" @menu-change="setActiveMenu" />

    <!-- Main Content Area -->
    <div class="main-wrapper">
      <!-- Top Navigation Bar -->
      <TopNavBar 
        :current-page="currentPageName" 
        :current-icon="currentPageIcon"
        :username="displayUsername"
        @logout="handleLogout"
        @settings-action="handleSettingsAction"
      />

      <!-- Content Area -->
      <ContentArea :page-name="currentPageName">
        <!-- 动态组件 -->
        <component :is="currentComponent" :page-name="currentPageName" />
      </ContentArea>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed } from 'vue'
import TopNavBar from './TopNavBar.vue'
import SideBar from './SideBar.vue'
import ContentArea from './ContentArea.vue'
import HomePage from './pages/HomePage.vue'
import TemplatePage from './pages/TemplatePage.vue'
import SupplierPage from './pages/SupplierPage.vue'
import RecordPage from './pages/RecordPage.vue'
import AcceptApprovePage from './pages/AcceptApprovePage.vue'
import MoveApprovePage from './pages/MoveApprovePage.vue'
import AcceptHistoryPage from './pages/AcceptHistoryPage.vue'

const emit = defineEmits(['logout'])

const props = defineProps({
  username: {
    type: String,
    default: '游客'
  }
})

const activeMenu = ref('home')

const menuItems = [
  { name: '首页', path: 'home', icon: 'fas fa-home' },
  { name: '验收管理', path: 'accept-approve', icon: 'fas fa-clipboard-check' },
  { name: '移模审批', path: 'move-approve', icon: 'fas fa-exchange-alt' },
  { name: '模板管理', path: 'template', icon: 'fas fa-cube' },
  { name: '历史验收', path: 'accept-history', icon: 'fas fa-history' },
  { name: '操作记录', path: 'record', icon: 'fas fa-clipboard-list' },
  { name: '供应商管理', path: 'supplier', icon: 'fas fa-truck' }
]

const currentPageName = computed(() => {
  const item = menuItems.find(item => item.path === activeMenu.value)
  return item ? item.name : '首页'
})

const currentPageIcon = computed(() => {
  const item = menuItems.find(item => item.path === activeMenu.value)
  return item ? item.icon : 'fas fa-home'
})

// 动态组件映射
const componentMap = {
  '首页': HomePage,
  '验收管理': AcceptApprovePage,
  '移模审批': MoveApprovePage,
  '模板管理': TemplatePage,
  '历史验收': AcceptHistoryPage,
  '操作记录': RecordPage,
  '供应商管理': SupplierPage
}

const currentComponent = computed(() => {
  return componentMap[currentPageName.value] || HomePage
})

// 计算属性：获取用户名（有传入使用传入的，否则从localStorage获取）
const displayUsername = computed(() => {
  return props.username || localStorage.getItem('savedUsername') || '游客'
})

const setActiveMenu = (path) => {
  activeMenu.value = path
}

const handleLogout = () => {
  emit('logout')
}

const handleSettingsAction = (action) => {
  // 处理各种设置操作
  switch(action) {
    case 'personal':
      alert('打开个人设置')
      break
    case 'password':
      alert('打开修改密码')
      break
    case 'system':
      alert('打开系统设置')
      break
    case 'backup':
      alert('执行数据备份')
      break
    case 'export':
      alert('导出数据')
      break
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
