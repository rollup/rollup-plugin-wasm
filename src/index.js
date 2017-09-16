
import fs from 'fs'
import spawn from 'execa'
import { file as temp } from 'tempy'
import promisify from 'util-promisify'

const read = promisify(fs.readFile)
const unlink = promisify(fs.unlink)

function compileWasm (code) {
  if (code) return `export default _loadWasmModule('${code}')`
}

export default function wasm (options = {}) {
  options = Object.assign({}, options)

  // Default to simple universal load
  if (!options.load) options.load = wabt.load

  // Turn it into a string for embedding in client code
  options.load = options.load.toString()

  // Fix quirk where "foo () { }" method syntax breaks the expression
  if (
    /^([^\ ]+)(\s*)\(.*\)(\s*)\{/.test(options.load) &&
    !/^function(\s*)\(/.test(options.load)
  ) {
    options.load = 'function ' + options.load
  }

  return {
    name: 'wasm',
    
    banner:  `\
      function _loadWasmModule (src) {
        var len = src.length
        var trailing = src[len-2] == '=' ? 2 : src[len-1] == '=' ? 1 : 0 
        var buf = new Uint8Array((len * 3/4) - trailing)

        var _table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
        var table = new Uint8Array(130)
        for (var c = 0; c < _table.length; c++) table[_table.charCodeAt(c)] = c
        
        for (var i = 0, b = 0; i < len; i+=4) {
          var second = table[src.charCodeAt(i+1)]
          var third = table[src.charCodeAt(i+2)]
          buf[b++] = (table[src.charCodeAt(i)] << 2) | (second >> 4)
          buf[b++] = ((second & 15) << 4) | (third >> 2)
          buf[b++] = ((third & 3) << 6) | (table[src.charCodeAt(i+3)] & 63)
        }

        return (${options.load})(buf)
      }
    `.trim(),
    
    transform (code, id) {      
      if (/\.wasm$/.test(id)) {
        // Compile wasm -> js
        return compileWasm(Buffer.from(code, 'binary').toString('base64'))
      } else if (options.compile) {
        // Compile source code -> wasm -> js
        return Promise.resolve(options.compile(code, id)).then(compileWasm)
      }
    }
  }
}

export const emscripten = {
  compile (code, id) {
    if (/.(c|cc|cpp)$/.test(id)) {
      const temppath = temp({ extension: 'wasm' })
      return spawn('emcc', [id, '-Os', '-s', 'BINARYEN=1', '-s', 'SIDE_MODULE=1', '-o', temppath])
        .then(results => read(temppath, 'base64'))
        .then(contents => unlink(temppath).then(() => contents))
    }    
  },
  // From https://gist.github.com/kripken/59c67556dc03bb6d57052fedef1e61ab
  load (buf) {
    var module = new WebAssembly.Module(buf)
    var instance = new WebAssembly.Instance(module, {
      env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({ initial: 256 }),
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
        _puts: console.log
      }
    })
    instance.exports.__post_instantiate()
    return instance.exports 
  }
}

export const wabt = {
  compile (code, id) {
    if (/.wa(t|st)$/.test(id)) {
      const temppath = temp({ extension: 'wasm' })
      return spawn('wat2wasm', [id, '-o', temppath])
        .then(results => read(temppath, 'base64'))
        .then(contents => unlink(temppath).then(() => contents))
    }
  },
  load (buf) {
    return imports => {
        var module = WebAssembly.Module(buf)
        var instance = WebAssembly.Instance(module, imports)
        return instance.exports
     }
  }
}


