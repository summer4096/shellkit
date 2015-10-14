import test from 'blue-tape'
import * as sh from '../'

test('touch', async function (t) {
  let touchPath = __dirname + '/junk/touchTest'

  t.false((await sh.exists(touchPath)), 'touchTest should not exist to begin with')
  await sh.touch(touchPath)
  t.true((await sh.exists(touchPath)), 'touchTest should exist after sh.touch finishes')
  t.true((await sh.isFile(touchPath)), 'touchTest should be a file')
  t.equal((await sh.cat(touchPath)), '', 'touchTest should be empty')
  await sh.rm(touchPath)
  t.false((await sh.exists(touchPath)), 'touchTest should not exist after being deleted')
})
