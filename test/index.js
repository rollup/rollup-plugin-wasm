
import { rollup } from 'rollup'
import wasm from '../src/index.js'
import test from 'tape'

test('bundles wasm code', t => {

  t.plan(2)

  rollup({
    input: 'test/fixture/test.js',
    plugins: [
      wasm()
    ]
  }).then(bundle => {
    return bundle.generate({ format: 'iife' })
  }, t.error).then(({code}) => {

    console.log(code)

    var funcdef = code.indexOf('function _loadWasmModule')
    var wasmimport = code.indexOf('_loadWasmModule(\'AG')
    
    t.not(-1, funcdef, 'found wasm load definition')
    t.not(-1, wasmimport, 'found wasm load import')

  }, t.error)


})
