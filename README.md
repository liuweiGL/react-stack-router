## react-stack-router

一个简单的栈路由，适用于手机端。

## 文档

// TODO

## vite

Uncaught ReferenceError: module is not defined: https://github.com/vitejs/vite/issues/6215

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react/jsx-runtime']
  }
})
```
