
# rollup-plugin-wasm

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Rollup plugin for importing WebAssembly modules.

Use this [Rollup](https://github.com/rollup/rollup) plugin to import [WebAssembly modules](http://webassembly.org) and bundle them as base64 strings.  They are imported async (but small modules [can be imported sync](#sync-modules)).

## Install

```
npm i -D rollup-plugin-wasm
```

## Configuration

Add the plugin to your rollup config and then any imported `.wasm` file will be processed by it.

```js
import wasm from 'rollup-plugin-wasm'

export default {
  input: 'web/index.js',
  plugins: [
    wasm()
  ]
}
```

## Example

Given the following simple C file (compiled using emscripten, or the online [WasmFiddle](https://wasdk.github.io/WasmFiddle//) tool):

```c
int main() {
  return 42;
}
```

Import and instantiate the resulting file:

```js
import wasm from './sample.wasm';

sample({ ...imports }).then(({ instance }) => {
  console.log(instance.exports.main())
})
```

The WebAssembly is inlined as a base64 encoded string (which means it will be ~33% larger than the original). At runtime the string is decoded and a module is returned.

### Sync Modules

Small modules (< 4KB) can be compiled synchronously by specifying them in the configuration.

```js
wasm({
  sync: [
    'web/sample.wasm',
    'web/foobar.wasm'
  ]
})
```

This means that the exports can be accessed immediately.

```js
import module from './sample.wasm'

const instance = sample({ ...imports })

console.log(instance.exports.main())
```
