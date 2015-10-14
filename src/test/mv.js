import test from 'blue-tape'
import * as sh from '../'

test('mv', async function (t) {
  let srcPath = __dirname + '/junk/mvTest'
  let destPath = __dirname + '/junk/mvTestDest'

  t.true((await sh.exists(srcPath)), 'src must exist to begin with')
  await sh.mv(srcPath, destPath)
  t.false((await sh.exists(srcPath)), 'after `mv src dest`, src must be gone')
  t.true((await sh.exists(destPath)), 'after `mv src dest`, dest must exist')
  await sh.mv(destPath, srcPath)
  t.false((await sh.exists(destPath)), 'after `mv dest src`, src must exist again')
  t.true((await sh.exists(srcPath)), 'after `mv dest src`, dest must exist')
})
