import fs from 'fs'
import os from 'os'
import rimraf from 'rimraf'
import mkpath from 'mkpath'
import stream from './stream'
import { file as tmpFilePath, dir as tmpDirPath } from './temp'
import promisify from './promisify'
import generatorToAsync from './generatorToAsync'
import { PassThrough } from 'stream'

export stream from './stream'
export { spawn, exec } from './childProcess'
export let parallel = Promise.all.bind(Promise)
export let echo = console.log.bind(console)
export let exit = process.exit.bind(process)
export let ls = promisify(fs.readdir)
export let mv = promisify(fs.rename)
export let writeFile = promisify(fs.writeFile)
export function appendFile (filename, data, options) {
  options = options || {}
  options.flag = 'a'
  return writeFile(filename, data, options)
}
export let exists = path => new Promise(resolve => {
  fs.access(path, fs.F_OK, err => resolve(!err))
})
export let rm = promisify(fs.unlink)
export let rmrf = promisify(rimraf)
export let rmdir = promisify(fs.rmdir)
export let chown = promisify(fs.chown)
export let chmod = promisify(fs.chmod)
export let stat = promisify(fs.stat)
export let lstat = promisify(fs.lstat)
export let mkdir = promisify(fs.mkdir)
export let mkdirp = promisify(mkpath, 'mkdirp')
export let uptime = os.uptime
export let loadavg = os.loadavg

export function script (fn) {
  if (fn.constructor.name === 'GeneratorFunction') {
    fn = generatorToAsync(fn)
  }

  Promise.resolve()
    .then(fn)
    .then(() => process.exit(0))
    .catch(e => {
      console.error(`Uncaught exception ${e}\n${e.stack}`)
      process.exit(1)
    })
}

let open = promisify(fs.open)
let close = promisify(fs.close)
export async function touch (path) {
  let fd = await open(path, 'a')
  await close(fd)
}

export async function isFile (path) {
  let stats = await stat(path)
  return stats.isFile()
}
export async function isDirectory (path) {
  let stats = await stat(path)
  return stats.isDirectory()
}
export async function isBlockDevice (path) {
  let stats = await stat(path)
  return stats.isBlockDevice()
}
export async function isCharacterDevice (path) {
  let stats = await stat(path)
  return stats.isCharacterDevice()
}
export async function isSymbolicLink (path) {
  let stats = await lstat(path)
  return stats.isSymbolicLink()
}
export async function isFIFO (path) {
  let stats = await stat(path)
  return stats.isFIFO()
}
export async function isSocket (path) {
  let stats = await stat(path)
  return stats.isSocket()
}

async function pipeAll (fns, out) {
  for (let fn of fns) {
    let str = fn()
    await stream(str).pipe(out, {end: false}).completion
  }
  out.end()
}

export function cat (...paths) {
  let pass = stream(new PassThrough())
  pipeAll(paths.map(path => () => fs.createReadStream(path)), pass)
  return pass
}

export function cd (path) {
  process.chdir(path)
}

export function cwd () {
  return process.cwd()
}

export let env = process.env

export async function cp (src, dest, opts) {
  await cat(src).to(dest, opts)
}

export async function tmpfile (extension, basedir) {
  let path
  do {
    path = tmpFilePath(extension, basedir)
  } while (await exists(path))
  return path
}
export async function tmpdir (parent) {
  let path = tmpDirPath(parent)
  await mkdirp(path)
  return path
}

export function sleep (seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}
