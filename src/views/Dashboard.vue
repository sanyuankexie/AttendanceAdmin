<!-- App.vue -->
<template>
  <el-container class="layout-container">
    <!-- 左侧菜单栏 -->
    <el-aside width="200px" class="sidebar">
      <div class="logo">科协后台管理系统</div>
      <el-menu
        router
        :default-active="$route.path"
        class="nav-menu"
      >
        <el-menu-item index="/">
          <el-icon><PieChart /></el-icon>
          <span>签到时长管理</span>
        </el-menu-item>

        <el-sub-menu>
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/add">
            <el-icon><Plus/></el-icon>
            <span>添加用户</span>
          </el-menu-item>
          <el-menu-item index="/sub">
            <el-icon><Minus/></el-icon>
            <span>移除用户</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/appeal">
          <el-icon><Notification/></el-icon>
          <span>申诉处理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容区 -->
    <el-container>
      <el-header class="header">
        <div class="header-title">{{ currentRouteTitle }}</div>
        <div class="header-subTitle">管理员用户：{{ id }}</div>
        <el-button color="red" @click="exit">退出</el-button>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Minus, Plus } from '@element-plus/icons-vue'
import { Utils } from '@/utils/decrypt.js'

const route = useRoute()

const id = Utils.decrypt(localStorage.getItem('id'), 'kexieisbest')

const exit = () => {
  localStorage.clear()
}

const currentRouteTitle = computed(() => {
  return route.meta.title || '管理系统'
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  transition: width 0.3s;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  background-color: #6bbdf6;
}

.nav-menu {
  border-right: none;
}

.header {
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
}

.header-subTitle {
  font-size: 18px;
  font-weight: 500;
  margin-left: auto;
  margin-right: 15px;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}

</style>
