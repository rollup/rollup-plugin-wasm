
# rollup-plugin-wasm

> Import WebAssembly code with Rollup

Use this [Rollup](https://github.com/rollup/rollup) plugin to import WebAssembly modules.

By default, WebAssembly modules are imported as a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), But you can use the `sync` flag to specify otherwise (See ["Sync Modules"](#sync_modules)).

## Install

```
npm i -D rollup-plugin-wasm
```

**Note:** For quick-start configs to work you must install their parent projects (Emscripten, WABT, etc.)

## Usage

First, load the plugin into your rollup config

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

Then import & instantiate WebAssembly modules:

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

## Sync Modules

You can compile modules synchronously by specifying it in the config

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

Which import the modules directly instead of being wrapped in a promise

```js
import sample from './sample.wasm'

const instance = new WebAssembly.Instance(sample, {
  // imports
})

console.log(instance.exports.main())
```
