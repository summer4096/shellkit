import test from 'blue-tape'
import * as sh from '../'

test('tmpdir', async function (t) {
  let dir = await sh.tmpdir()
  t.true((await sh.exists(dir)), 'should exist')
  t.true((await sh.isDirectory(dir)), 'should be a directory')
  t.deepEqual((await sh.ls(dir)), [], 'should be empty')
  await sh.touch(dir + '/test')
  t.true((await sh.exists(dir + '/test')), 'should be writable')
})

test('tmpfile', async function (t) {
  let file = await sh.tmpfile()
  t.false((await sh.exists(file)), 'should not exist')
  await sh.touch(file)
  t.true((await sh.exists(file)), 'should be writable')
})
