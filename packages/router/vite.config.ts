import path from 'path'
import { defineConfig } from 'vite'

// https://cn.vitejs.dev/guide/build.html#library-mode
module.exports = defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      formats: ['es', 'umd'],
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'react-mobile-router',
      fileName: format => `react-mobile-router.${format}.js`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: 'React'
        }
      }
    }
  }
})
