
const dependencies = Object.keys(require('./package.json').dependencies || {})

export default [
  {
    input: 'src/index.js',
    output: { file: 'dist/rollup-plugin-wasm.js', format: 'cjs' },
    external: ['path'].concat(dependencies),
    exports: 'named'
  },
  {
    input: 'test/index.js',
    output: { file: 'dist/test.js', format: 'cjs' }
  }
]

