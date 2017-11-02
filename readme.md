
# rollup-plugin-wasm

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> A rollup plugin that inlines (base64 encoded) and imports WebAssembly modules.

Use this [rollup](https://github.com/rollup/rollup) plugin to import WebAssembly modules.  They are inlined and base64 encoded, with the compiled module binary returned as a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). For small modules you can use the `sync` option if you wish (see [Sync Modules](#sync_modules)).

## Install

```
npm install --save-dev rollup-plugin-wasm
```

## Configuration

Simply add the plugin to your rollup config. Any imported file with the `wasm` extension will be processed by this plugin.

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

Given the following simple C file, compiled to wasm (using emscripten, or the online [WasmFiddle](https://wasdk.github.io/WasmFiddle//) tool):

~~~c
int main() {
  return 42;
}
~~~

The plugin will look for any wasm imports. For any it finds, the wasm file is inlined as a base64 encoded string (which means it will be ~33% larger than the original). At runtime the string is decoded and asynchronously compiled into a wasm module.

To use the binary module returned by the plugin, you must first intantiate it as shown below:

~~~javascript
import wasm from './hello.wasm';

wasm
  .then(module => WebAssembly.instantiate(module))
  .then(instance => {
    console.log(instance.exports.main())
  });
~~~

### Sync Modules

Small modules (< 4KB) can be compiled synchronously by specifying them in the configuration.

```js
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

This returns the binary module synchronously, which can be instantiated as follows:

```js
import module from './hello.wasm'

const instance = new WebAssembly.Instance(module);

console.log(instance.exports.main())
```
