const fs = require('fs')
const path = require('path')
const { build } = require('esbuild')
const { dtsPlugin } = require('esbuild-plugin-d.ts')

const outDir = path.resolve(__dirname, 'dist/')

const emptyDir = () => {
  fs.rmSync(outDir, {
    recursive: true
  })
}

emptyDir()

build({
  entryPoints: ['./src/index.ts'],
  external: ['react'],
  format: 'esm',
  bundle: true,
  watch: process.argv.slice(2).includes('watch'),
  outfile: path.resolve(outDir, 'react-mobile-router.js'),
  sourcemap: 'linked',
  target: 'esnext',
  plugins: [
    dtsPlugin({
      outDir
    })
  ]
})
