
# rollup-plugin-wasm

> Import WebAssembly modules using Rollup

Use this [Rollup plugin](https://rollupjs.org) to import [WebAssembly](https://webassembly.org) modules. All `.wasm` files are embed as base64 strings.  Additionally, `.wat` and `.wast` files are compiled with [WABT](https://github.com/webassembly/wabt) before being embedded. (See also [`webassembly-binary-toolkit`](https://npmjs.com/webassembly-binary-toolkit))

## Install

```
npm i -D rollup-plugin-wasm
```

**Note:** Compiling `.wat`/`.wast` files requires [installing WABT's `wat2wasm`](https://github.com/webassembly/wabt).

## Usage

Load the plugin in your Rollup config:

```js
import wasm from 'rollup-plugin-wasm'

export default {
  plugins: [
    wasm()
  ]
}
```

Which allows you to import `.wasm`/`.wat`/`.wast` files:

```js
import example from './example.wat'

// WASM module signature:
// init(imports?) -> Promise<exports?>

example().then(fns => {
  fns.main()
})
```

The WASM program is embedded in your bundle as base64, so there is 33% overhead in size.

