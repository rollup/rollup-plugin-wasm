
import sample from './sample.wasm'

var instance1 = sample({ env: {} })

t.is(instance1.exports.main(), 3, 'wasm loaded')

var instance2 = new WebAssembly.Instance(sample(), { env: {} })

t.is(instance2.exports.main(), 3, 'wasm loaded (via module)')
