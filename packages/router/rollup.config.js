const fs = require('fs')
const path = require('path')
const { defineConfig } = require('rollup')
const typescript = require('@rollup/plugin-typescript')

// 构建输出目录
const OUT_DIR = 'dist/'

// 防止 watch 模式下重复清空
let cleanable = true

/**
 * 清空构建目录
 *
 * @returns  @type {import('rollup').Plugin}
 */
const clean = () => {
  return {
    name: 'clean',
    buildStart() {
      const distPath = path.resolve(__dirname, OUT_DIR)
      if (cleanable && fs.existsSync(distPath)) {
        cleanable = false
        fs.rmSync(distPath, {
          recursive: true
        })
      }
    }
  }
}

/**
 * 从上级目录复制一些共用的文件
 *
 * @returns  @type {import('rollup').Plugin}
 */
const copy = () => {
  return {
    name: 'copy',
    buildStart() {
      fs.copyFileSync(
        path.resolve(__dirname, '../..', 'README.md'),
        path.resolve(__dirname, 'README.md')
      )
    }
  }
}

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      format: 'esm',
      sourcemap: true,
      file: `${OUT_DIR}react-stack-router.es.js`
    },
    {
      format: 'commonjs',
      sourcemap: true,
      file: `${OUT_DIR}react-stack-router.cjs.js`
    }
  ],
  external: ['history', 'react', 'react/jsx-runtime'],
  plugins: [
    clean(),
    copy({}),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        outDir: 'types'
      }
    })
  ]
})
