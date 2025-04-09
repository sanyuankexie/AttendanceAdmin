import axios from 'axios'

// 创建自定义实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // 从环境变量获取
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 在这里统一处理请求配置，例如添加 token
    const token = '111' // 从 store 或 localStorage 获取真实 token
    if (token) {
      config.headers['Token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default http
