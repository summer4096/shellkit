import test from 'blue-tape'
import * as sh from '../'

test('writeFile', async function (t) {
  let writePath = __dirname + '/junk/writeFileTest'

  t.false((await sh.exists(writePath)), 'writePath must not exist when the test starts')
  await sh.writeFile(writePath, 'Hello, World!')
  t.true((await sh.exists(writePath)), 'writePath must exist after sh.writeFile')
  t.equal((await sh.cat(writePath)), 'Hello, World!', 'writePath must say "Hello, World!"')
  await sh.rm(writePath)
  t.false((await sh.exists(writePath)), 'writePath must not exist after we try to remove it')
})
