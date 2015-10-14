import test from 'blue-tape'
import * as sh from '../'

test('appendFile', async function (t) {
  let appendPath = __dirname + '/junk/appendFileTest'

  t.false((await sh.exists(appendPath)), 'appendPath must not exist when the test starts')
  await sh.writeFile(appendPath, 'Hello, ')
  t.true((await sh.exists(appendPath)), 'appendPath must exist after sh.writeFile')
  t.equal((await sh.cat(appendPath)), 'Hello, ', 'appendPath must say "Hello, "')
  await sh.appendFile(appendPath, 'World!')
  t.true((await sh.exists(appendPath)), 'appendPath must exist after sh.appendFile')
  t.equal((await sh.cat(appendPath)), 'Hello, World!', 'appendPath must say "Hello, World!"')
  await sh.rm(appendPath)
  t.false((await sh.exists(appendPath)), 'appendPath must not exist after we try to remove it')
})
