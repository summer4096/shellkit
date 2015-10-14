import test from 'blue-tape'
import * as sh from '../'

test('rm', async function (t) {
  let rmPath = __dirname + '/junk/rmTest'

  t.true((await sh.exists(rmPath)), 'rmPath must exist to begin with')
  t.true((await sh.isFile(rmPath)), 'rmPath must be a file')
  await sh.rm(rmPath)
  t.false((await sh.exists(rmPath)), 'rmPath must be gone now')
  await sh.touch(rmPath)
  t.true((await sh.exists(rmPath)), 'rmPath must come back')
  t.true((await sh.isFile(rmPath)), 'rmPath must be a file')
})
