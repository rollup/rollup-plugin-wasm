
import sample from './sample.wasm'

sample
.then(module => {
  return WebAssembly.instantiate(module, {
    // ...
  })
})
.then(instance => {
  t.is(instance.exports.main(), 3, 'wasm loaded')
})

