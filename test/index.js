
import { rollup } from 'rollup'
import wasm, { wabt, emscripten } from '../src/index.js'
import test from 'tape'

test('Bundling .wasm code', t => {
  t.plan(1)

  rollup({
    input: 'test/fixture/wasm.js',
    plugins: [
      wasm()
    ],
  })
  .then(bundle => bundle.generate({ format: 'iife' }), t.error)
  .then(result => {
    t.true(result, 'got wasm bundle')
    // demo:
    // console.log(result.code)
  })
})

test('Bundling .wat code', t => {
  t.plan(2)

  rollup({
    input: 'test/fixture/wat.js',
    plugins: [
      wasm(wabt)
    ],
  })
  .then(bundle => bundle.generate({ format: 'iife' }), t.error)
  .then(result => {
    var code = result.code
    var funcdef = code.indexOf('function _loadWasmModule')
    var wasmimport = code.indexOf('_loadWasmModule(\'AG')
    
    t.not(-1, funcdef, 'found wasm load definition')
    t.not(-1, wasmimport, 'found wasm load call')

    // demo:
    // console.log(code)
  }, t.error)
})

test('Bundling .cc code', t => {
  t.plan(1)

  rollup({
    input: 'test/fixture/cc.js',
    plugins: [
      wasm(emscripten)
    ],
  })
  .then(bundle => bundle.generate({ format: 'iife' }), t.error)
  .then(result => {
    var code = result.code
    var funcdef = code.indexOf('anyfunc')
    
    t.not(-1, funcdef, 'found custom wasm load')

    // demo:
    // console.log(code)
  }, t.error)
})
