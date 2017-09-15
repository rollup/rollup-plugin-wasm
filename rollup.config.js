
export default [
  {
    input: 'src/index.js',
    output: { file: 'dist/rollup-plugin-wasm.js', format: 'cjs' },
    external: ['fs', 'child_process'].concat(Object.keys(require('./package.json').dependencies)),
    exports: 'named'
  },
  {
    input: 'test/index.js',
    output: { file: 'dist/test.js', format: 'cjs' }
  }
]

