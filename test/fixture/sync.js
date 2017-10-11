
import sample from './sample.wasm'

var instance = new WebAssembly.Instance(sample, {
  // ...
})

t.is(instance.exports.main(), 3, 'wasm loaded')

