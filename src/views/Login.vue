<template>
  <div class="login-container">
    <el-card class="login-box">
      <h2 class="login-title">管理员验证</h2>
      <el-form :model="form" :rules="rules" ref="loginForm">
        <el-form-item prop="id">
          <el-input
            v-model="form.id"
            placeholder="学号"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-button
          type="primary"
          @click="handleLogin"
          class="login-btn"
        >
          进入
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import http from '@/utils/axios.js'

const router = useRouter()
const form = reactive({
  id: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名'}],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  // 模拟登录成功
  const client = axios.create({
    baseURL: '/api', // 从环境变量获取
    timeout: 10000, // 请求超时时间
  })
  const res = await http.post('/api/user/login', {
    id: Number(form.id),
    password: form.password
  })
  if (res.data.code === 0) {
    localStorage.setItem('id', res.data.data)
    console.log('跳转')
    await router.push('/')
  } else {
    ElMessage.error("认证失败")
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  margin: 0;
  padding: 0;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-box {
  width: 400px;
  padding: 30px;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}
</style>
