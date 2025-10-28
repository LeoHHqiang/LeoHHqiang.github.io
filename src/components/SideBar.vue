<template>
  <aside class="sidebar">
    <div class="logo">
      <h1><i class="fas fa-toolbox"></i>模具管理系统</h1>
    </div>
    
    <ul class="menu">
      <li 
        v-for="item in menuItems" 
        :key="item.path"
        :class="['menu-item', { active: activeMenu === item.path }]"
        @click="handleMenuClick(item.path)"
      >
        <a>
          <i :class="item.icon"></i>
          <span class="menu-text">{{ item.name }}</span>
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
/* eslint-disable */

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'home'
  }
})

const emit = defineEmits(['menu-change'])

const menuItems = [
  { name: '首页', path: 'home', icon: 'fas fa-home' },
  { name: '验收审批', path: 'accept-approve', icon: 'fas fa-clipboard-check' },
  { name: '移模审批', path: 'move-approve', icon: 'fas fa-exchange-alt' },
  { name: '模板管理', path: 'template', icon: 'fas fa-cube' },
  { name: '历史验收', path: 'accept-history', icon: 'fas fa-history' },
  { name: '操作记录', path: 'record', icon: 'fas fa-clipboard-list' },
  { name: '供应商管理', path: 'supplier', icon: 'fas fa-truck' }
]

const handleMenuClick = (path) => {
  emit('menu-change', path)
}
</script>

<style scoped>
.sidebar {
  width: 180px;
  height: 100vh;
  background: linear-gradient(180deg, #2c3e50, #1a2530);
  color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  overflow-y: auto;
}

.logo {
  display: flex;
  height: 70px;
  background: #008DF7;
}

.logo h1 {
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
  color: #ffffff;
}

.logo i {
  color: #ffffff;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
}

.menu-item a {
  color: inherit;
  text-decoration: none;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-text {
  font-size: 16px;
}

.menu-item:hover,
.menu-item.active {
  background-color: #34495e;
  border-left: 4px solid #008DF7;
}

.menu-item.active i {
  color: #008DF7;
}

/* Scrollbar Styles */
.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
