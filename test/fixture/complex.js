
import sample from './complex.wasm'

sample({
  env: {
    memory: new WebAssembly.Memory({ initial: 1 }),
    log: console.log
  }
})
.then(({ instance }) => t.is(instance.exports.parse(), 0, 'wasm loaded'))

sample()
  .then(module => WebAssembly.instantiate(module, {
    env: {
      memory: new WebAssembly.Memory({ initial: 1 }),
      log: console.log
    }
  }))
.then(instance => t.is(instance.exports.parse(), 0, 'wasm loaded (via module)'))
