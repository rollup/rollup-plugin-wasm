
import path from 'path'

export default function wasm (options = {}) {
  options = Object.assign({}, options)

  const syncFiles = (options.sync || []).map(x => path.resolve(x))

  return {
    name: 'wasm',

    banner:  `
      function _loadWasmModule (sync, src, imports) {
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

        if (imports && !sync) {
          return WebAssembly.instantiate(buf, imports)
        } else if (!imports && !sync) {
          return WebAssembly.compile(buf)
        } else {
          var mod = new WebAssembly.Module(buf)
          return imports ? new WebAssembly.Instance(mod, imports) : mod
        }
      }
    `.trim(),

    transform (code, id) {
      if (code && /\.wasm$/.test(id)) {
        const src = Buffer.from(code, 'binary').toString('base64')
        const sync = syncFiles.indexOf(id) !== -1
        return `export default function(imports){return _loadWasmModule(${+sync}, '${src}', imports)}`
      }
    }
  }
}
