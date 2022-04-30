import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/router/index.ts'),
      name: 'react-stack-router',
      formats: ['es', 'umd'],
      fileName: format => `react-stack-router.${format}.js`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react', 'history', 'react-freeze', 'path-to-regexp'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: 'React'
        }
      }
    }
  },
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ]
})
