
import sample from './sample.wasm'

sample({ env: {} })
.then(({ instance }) => t.is(instance.exports.main(), 3, 'wasm loaded'))

sample()
.then(module => WebAssembly.instantiate(module, { env: {} }))
.then(instance => t.is(instance.exports.main(), 3, 'wasm loaded (via module)'))
