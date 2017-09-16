
# rollup-plugin-wasm

> Import WebAssembly code with Rollup

Use this [Rollup plugin](https://rollupjs.org) to import source code which compiles to WebAssembly (such as C, C++, Wat, Rust), or just import standalone `.wasm` binaries.  There are a few configs to quick-start languages:

 - `wasm.emscripten` for C and C++ using [Emscripten](https://github.com/kripken/emscripten)
 - `wasm.wabt` for WAT using [WABT](https://github.com/webassembly/wabt)
 - Others? [Submit an issue](https://github.com/jamen/rollup-plugin-wasm/issues/new)

You can also create your own configs. See [Configs](#configurations) and [`src/index.js`](https://github.com/jamen/rollup-plugin-wasm/blob/master/src/index.js) for more details.

## Install

```
npm i -D rollup-plugin-wasm
```

**Note:** For quick-start configs to work you must install their parent projects (Emscripten, WABT, etc.)

## Usage

Load the plugin in your `rollup.config.js`:

```js
import wasm from 'rollup-plugin-wasm'

export default {
  plugins: [ wasm() ]
}
```

You can use the configs like so:

```js
import wasm, { emscripten } from 'rollup-plugin-wasm'

export default {
  plugins: [ wasm(emscripten) ]
}
```

### `wasm(config)`

The base of the plugin lets you require plain `.wasm` files.  You can use your own commands to compile standalone binaries, and then import them from JavaScript.

```js
import createFoo from './foo.wasm'

var foo = createFoo(imports)

foo.main()
```

But, you may also provide a config for importing source files.  More info below

### `wasm.emscripten`

For importing C and C++ an `emscripten` config is provided. It uses [Emscripten](https://github.com/kripken/emscripten)'s `emcc` command for the compilation.

```js
import sample from './sample.cc'

sample._main()
```

### `wasm.wabt`

For importing `.wat` the `wabt` config is provided, which uses [WABT](https://github.com/WebAssembly/WABT)'s `wat2wasm` command for the compilation.


```js
import createFoo from './foo.wat'

const foo = createFoo()

foo.main()
```

### Configs

The config objects are expressed as:

```js
{
  compile(code, id): Promise<wasm>,
  load(wasm): any
}
```

The `compile` function is responsible for turning a source file into WebAssembly.  For example, spawning the command of a compiler and getting the results.

The `load` function gets embed in the bundle, and is responsible for returning the exports for an import.  By default this is simply:

```js
load(wasm) -> init(imports) -> exports
```

Which looks like this from the source:

```js
import createFoo from './source.ex'

var exports = createFoo(imports)
```

