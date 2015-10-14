import os from 'os'
import childProcess from 'child_process'
import { Stream } from 'stream'
import taggedTemplateEscape from 'tagged-template-escape'
import shellEscapeArray from 'shell-escape'
import stream from './stream'

let shellEscape = taggedTemplateEscape((str) => shellEscapeArray([str]))

export function spawn (command, args, opts) {
  opts = opts || {}

  let child = childProcess.spawn(command, args, opts)
  let p = new Promise((resolve, reject) => {
    child.on('exit', (code, signal) => {
      if (code || signal) {
        let e = new Error(`Process exited with status code ${code} and signal ${signal}`)
        e.code = code
        e.signal = signal
        reject(e)
      } else {
        resolve()
      }
    })
  })

  child.then = p.then.bind(p)
  child.catch = p.catch.bind(p)

  if (child.stdin instanceof Stream) child.stdin = stream(child.stdin)
  if (child.stdout instanceof Stream) child.stdout = stream(child.stdout)
  if (child.stderr instanceof Stream) child.stderr = stream(child.stderr)
  child.code = new Promise(resolve => child.on('exit', code => resolve(code)))
  child.signal = new Promise(resolve => child.on('exit', (code, signal) => resolve(signal)))
  child.close = new Promise(resolve => child.on('close', () => resolve()))

  return child
}

let systemShell = os.platform() === 'win32' ? ['cmd.exe', '/s', '/c'] : ['sh', '-c']
function execWithOptions (options, strings, ...values) {
  options = options || {}
  values = values.map(value => {
    if (typeof value === 'number' || typeof value === 'object' || typeof value === 'boolean') {
      return value.toString()
    } else if (typeof value === 'string') {
      return value
    } else {
      throw new Error(`sh.exec can't interpolate ${typeof value} ${value}`)
    }
  })
  let command = shellEscape(strings, ...values)
  return spawn(systemShell[0], systemShell.slice(1).concat([command]), options)
}

export function exec (stringsOrOptions, ...values) {
  if (typeof stringsOrOptions === 'object' &&
      !Array.isArray(stringsOrOptions) &&
      typeof values !== 'undefined' &&
      Array.isArray(values)
    ) {
    return execWithOptions.bind(null, stringsOrOptions)
  } else {
    return execWithOptions({}, stringsOrOptions, ...values)
  }
}
