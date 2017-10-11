
# rollup-plugin-wasm

> Import WebAssembly code with Rollup

Use this [Rollup](https://github.com/rollup/rollup) plugin to import WebAssembly modules.  They are imported as a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) from being compiled asynchronously, but you can use the `sync` option for small modules if you wish (see [Sync Modules](#sync_modules)).

## Install

```
npm i -D rollup-plugin-wasm
```

## Usage

First, load the plugin into your rollup config.

```js
import { rollup } from 'rollup'
import wasm from 'rollup-plugin-wasm'

export default {
  input: 'web/index.js',
  plugins: [
    wasm()
  ]
}
```

Then, you can import & instantiate WebAssembly modules.

```js
import sample from './sample.wasm'

sample
.then(module => {
  return WebAssembly.instantiate(module, {
    // imports
  })
})
.then(instance => {
  console.log(instance.exports.main())
})
```

The imports are simply [`WebAssembly.Module`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module) objects which get instantiated by you.

### Sync Modules

Small modules (< 4KB) can be compiled synchronously by specifying them in the config.

```js
import { rollup } from 'rollup'
import wasm from 'rollup-plugin-wasm'

export default {
  input: 'web/index.js',
  plugins: [
    wasm({
      sync: [
        'web/sample.wasm',
        'web/foobar.wasm',
        'web/hello.wasm'
      ]
    })
  ]
}
```

This imports the `WebAssembly.Module` directly instead of being wrapped in a promise.

```js
import sample from './sample.wasm'

const instance = new WebAssembly.Instance(sample, {
  // imports
})

console.log(instance.exports.main())
```
