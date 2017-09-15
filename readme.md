
# rollup-plugin-wasm

> Import WebAssembly (or code that compiles to WebAssembly) with Rollup

Use this [Rollup plugin](https://rollupjs.org) to import code such as C, C++, Rust, Wat, anything that compiles to WebAssembly, or `.wasm` binaries themselves.  The built-in configs include:

 - C/C++ using  [Emscripten](https://github.com/kripken/emscripten) (see [`wasm(emscripten)`](#wasmemscripten))
 - WAT (WebAssembly Text) using [WABT](https://github.com/webassembly/wabt) (see [`wasm(wabt)`](#wasmwabt))
 - Others? [Submit an issue](https://github.com/jamen/rollup-plugin-wasm/issues/new)

Wrapping compilers can also be done yourself as a separate package. See [Configurations](#configurations) and [`src/index.js`](https://github.com/jamen/rollup-plugin-wasm/blob/master/src/index.js) for more details.

## Install

```
npm i -D rollup-plugin-wasm
```

**Note:** In order for built-in configs to work, you must install and build their parent projects.

## Usage

Load the plugin in your `rollup.config.js`:

```js
import wasm from 'rollup-plugin-wasm'

export default {
  plugins: [ wasm() ]
}
```

### `wasm()`

The base of the plugin lets you require plain `.wasm` files.  You can use your own commands to compile standalone binaries, and then import them from JavaScript.

```js
import createFoo from './foo.wasm'

var foo = createFoo(imports)

foo.main()
```

### `wasm(emscripten)`

For importing C/C++, an `emscripten` config is provided. It uses [Emscripten](https://github.com/kripken/emscripten)'s `emcc` command for the compilation.

```js
import wasm, { emscripten } from 'rollup-plugin-wasm'

export default {
  plugins: [ wasm(emscripten) ]
}
```

Then import and use C/C++ functions directly:

```js
import { _main } from './foo.cc'

_main()
```

### `wasm(wabt)`

Another config for importing `.wat` files is available, which uses [WABT](https://github.com/WebAssembly/WABT)'s `wat2wasm` command for the compilation.

```js
import wasm, { wabt } from 'rollup-plugin-wasm'

export default {
  plugins: [ wasm(wabt) ]
}
```

Then require `.wat` or `.wast` files:

```js
import createFoo from './foo.wat'

const foo = createFoo()

foo.main()
```

### Configurations

The configuration objects are expressed as:

```js
{
  compile(code, id): Promise<wasm>,
  load(wasm): any
}
```

The `compile` function is responsible for turning a source file into WebAssembly.  For example, spawning the command of a compiler and getting the results.

The `load` function gets embed in the bundle, and is responsible for returning the exports for an import.  By default this is simply:

```js
load(wasm) -> init
init(imports) -> exports
```

Which looks like:

```js
import createFoo from './source.ex'

var { ...exports } = createFoo({ ...imports })
```

