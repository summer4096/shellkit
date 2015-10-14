import path from 'path'
import os from 'os'
import { sync as rmSync } from 'rimraf'

let temporaryStuff = []
function cleanup () {
  temporaryStuff.forEach(f => rmSync(f))
}

let cleanupScheduled = false
function scheduleCleanup () {
  if (!cleanupScheduled) {
    cleanupScheduled = true
    process.on('exit', cleanup)
  }
}

let iterator = 0
function randomName () {
  let now = new Date()
  iterator++
  return `${now.getYear()}-${now.getMonth()}-${now.getDate()}-${process.pid}-${iterator}-${(Math.random() * 0x100000000 + 1).toString(36)}`
}

let tempdir = os.tmpDir() || process.env['TMPDIR'] || process.env['TEMP'] || process.env['TMP']

export function file (extension, basedir) {
  basedir = basedir || tempdir

  let name = randomName()
  if (extension) {
    name += '.' + extension
  }
  name = path.join(basedir, name)

  temporaryStuff.push(name)
  scheduleCleanup()

  return name
}

export function dir (basedir) {
  basedir = basedir || tempdir

  let name = path.join(basedir, randomName())
  temporaryStuff.push(name)
  scheduleCleanup()

  return name
}
