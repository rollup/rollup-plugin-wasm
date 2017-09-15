
import fs from 'fs'
import { spawn } from 'child_process'
import { file as temp } from 'tempy'

function compileWat (code, id) {
  return new Promise((resolve, reject) => {
    const temppath = temp({ extension: 'wasm' })
    const args = [id, '-o', temppath]
    spawn('wat2wasm', args, { stdio: 'inherit' }).on('close', () => {
      fs.readFile(temppath, 'base64', (err, contents) => {
        if (err) return reject(err)
        fs.unlink(temppath, err => {
          if (err) return reject(err)
          else resolve(contents)
        })
      })
    })
  })
}

function compileWasm (code) {
  return `export default _loadWasmModule('${code}')`
} 

const loadWasmModule = `\
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
 
  return function (imports) {
    return WebAssembly.compile(buf)
    .then(mod => WebAssembly.Instance(mod, imports))
    .then(ins => ins.exports)
  }
}` 

export default function wasm (options = {}) {
  return {
    name: 'wasm',
    banner: loadWasmModule,
    transform (code, id) {
      if (!/\.wa(t|st|sm)$/.test(id)) {
        return null
      }

      if (/\.wasm$/.test(id)) {
        // Is .wasm
        return compileWasm(code)
      } else {
        // Is .wat/.wast
        return compileWat(code, id).then(compileWasm)
      }
    }
  }
}
