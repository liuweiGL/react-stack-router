const fs = require('fs')
const path = require('path')
const { defineConfig } = require('rollup')
const typescript = require('@rollup/plugin-typescript')

// 防止 watch 模式下重复清空
let cleanable = true
/**
 * 清空构建目录
 *
 * @param {string} dir
 * @returns  @type {import('rollup').Plugin}
 */
const clean = dir => {
  return {
    name: 'clean',
    buildStart(options) {
      const dirpath = path.resolve(__dirname, dir)
      if (cleanable && fs.existsSync(dirpath)) {
        cleanable = false
        fs.rmSync(dirpath, {
          recursive: true
        })
      }
    }
  }
}

const OUT_DIR = 'dist/'

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
    clean(OUT_DIR),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        outDir: 'types'
      }
    })
  ]
})
