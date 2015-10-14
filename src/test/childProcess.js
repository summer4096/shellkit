import test from 'blue-tape'
import * as sh from '../'

test('exec `echo Hello, World!`', async function (t) {
  let proc = sh.exec`echo Hello, World!`
  t.equal((await proc.stdout), 'Hello, World!\n', 'should write to stdout')
  t.equal((await proc.stderr), '', 'should not write to stderr')
  t.equal((await proc.code), 0, 'should exit with code 0')
  t.equal((await proc.signal), null, 'should exit with signal null')
})

async function testNonZeroExit (t, code) {
  let proc = sh.exec`exit ${code}`
  t.equal((await proc.code), code, `should exit with code ${code}`)
  try {
    await proc
    t.fail('should not resolve')
  } catch (e) {
    t.equal(e.message, `Process exited with status code ${code} and signal null`, 'error should have the correct message')
    t.equal(e.code, code, `error should have code ${code}`)
    t.equal(e.signal, null, 'error should have signal null')
  }
}

test('exec `exit 1`', async function (t) {
  testNonZeroExit(t, 1)
})

test('exec `exit 127`', async function (t) {
  testNonZeroExit(t, 127)
})

test('kill exec', async function (t) {
  let proc = sh.exec`sleep 1`
  proc.kill()
  let [code, signal] = await Promise.all([proc.code, proc.signal])
  t.equal(code, null)
  t.equal(signal, 'SIGTERM')
})

test('exec with cwd', async function (t) {
  let junkShell = sh.exec({
    cwd: __dirname + '/junk'
  })
  let proc = junkShell`pwd`
  t.equal((await proc.stdout), __dirname + '/junk\n')
})

test('exec with env', async function (t) {
  let envShell = sh.exec({
    env: {
      TEST_VAR: 'Hello, World!'
    }
  })
  let proc = envShell`echo $TEST_VAR`
  t.equal((await proc.stdout), 'Hello, World!\n')
})

test('exec with string escaping', async function (t) {
  let somethingEvil = `$(cat ${ __dirname + '/junk/evilTest' })`
  let output = await sh.exec`echo ${ somethingEvil }`.stdout
  t.equal(output, somethingEvil + '\n')
})

test('exec with multiple string escaping', async function (t) {
  let somethingEvil = `$(cat ${ __dirname + '/junk/evilTest' })`
  let output = await sh.exec`echo ${ somethingEvil } ${ somethingEvil }`.stdout
  t.equal(output, `${ somethingEvil } ${ somethingEvil }\n`)
})

test('exec with lots of escaping', async function (t) {
  let somethingEvil = `$(cat ${ __dirname + '/junk/evilTest' })`
  let output = await sh.exec`echo ${ 123.4567 } ${ somethingEvil } ${ somethingEvil }`.stdout
  t.equal(output, `123.4567 ${ somethingEvil } ${ somethingEvil }\n`)
})
