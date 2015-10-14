import test from 'blue-tape'
import * as sh from '../'

test('cd', async function (t) {
  let initialDir = sh.cwd()
  let targetDir = __dirname + '/junk'
  t.notEqual(initialDir, targetDir, 'should not start in the target dir')
  sh.cd(targetDir)
  t.equal(sh.cwd(), targetDir, 'should cd to the target dir')
  sh.cd(initialDir)
  t.equal(sh.cwd(), initialDir, 'should cd back to the initial dir')
})
