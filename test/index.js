
import { rollup } from 'rollup'
import wasm, { wabt, emscripten } from '../src/index.js'
import test from 'tape'

function testBundle (t, bundle) {
  bundle.generate({ format: 'cjs' })
  .then(({ code }) => {
    new Function('t', code)(t)
  })
}

test('async wasm code', t => {
  t.plan(1)

  rollup({
    input: 'test/fixture/sync.js',
    plugins: [
      wasm()
    ],
  })
  .then(bundle => testBundle(t, bundle))
})


test('async wasm code', t => {
  t.plan(1)

  rollup({
    input: 'test/fixture/async.js',
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

