import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://at.kexie.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/local': {
        target: 'http://localhost:8088',  // 本地 8088 端口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/local/, '')  // 将请求的 `/local` 部分去掉，发送到 localhost
      }
    }
  }
})
