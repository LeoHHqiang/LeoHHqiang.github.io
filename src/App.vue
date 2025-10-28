<template>
  <div id="app">
    <LoginPage v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
    <DashboardPage v-else :username="username" @logout="handleLogout" ref="dashboardPage" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginPage from './components/LoginPage.vue'
import DashboardPage from './components/DashboardPage.vue'

const isLoggedIn = ref(false)
const username = ref('')

const handleLoginSuccess = (userInfo) => {
  isLoggedIn.value = true
  // 如果有用户信息，保存用户名
  if (userInfo && userInfo.username) {
    username.value = userInfo.username
  } else {
    // 从本地存储获取用户名
    const savedUsername = localStorage.getItem('savedUsername')
    username.value = savedUsername || '游客'
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
  // 清除本地存储的登录信息
  localStorage.removeItem('savedUsername')
  localStorage.removeItem('savedPassword')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

#app {
  min-height: 100vh;
}
</style>