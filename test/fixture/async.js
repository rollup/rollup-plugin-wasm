
import sample from './sample.wasm'

sample
.then(module => {
  return WebAssembly.instantiate(module, {
    env: {}
  })
})
.then(instance => {
  t.is(instance.exports.main(), 3, 'wasm loaded')
})

