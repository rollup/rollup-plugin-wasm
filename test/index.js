
import { rollup } from 'rollup'
import wasm, { wabt, emscripten } from '../src/index.js'
import test from 'tape'

function testBundle (t, bundle) {
  bundle.generate({ format: 'cjs' })
  .then(({ code }) => {
    new Function('t', code)(t)
  })
}

test('async compiling', t => {
  t.plan(2)

  rollup({
    input: 'test/fixture/async.js',
    plugins: [
      wasm()
    ],
  })
  .then(bundle => testBundle(t, bundle))
})

test('complex module decoding', t => {
  t.plan(2)

  rollup({
    input: 'test/fixture/complex.js',
    plugins: [
      wasm()
    ],
  })
  .then(bundle => testBundle(t, bundle))
})

test('sync compiling', t => {
  t.plan(2)

  rollup({
    input: 'test/fixture/sync.js',
    plugins: [
      wasm({
        sync: [
          'test/fixture/sample.wasm'
        ]
      })
    ],
  })
  .then(bundle => testBundle(t, bundle))
})

test('imports', t => {
  t.plan(1)

  rollup({
    input: 'test/fixture/imports.js',
    plugins: [
      wasm({
        sync: [
          'test/fixture/imports.wasm'
        ]
      })
    ],
  })
  .then(bundle => testBundle(t, bundle))

})
