import test from 'blue-tape'
import * as sh from '../'

test('exists', async function (t) {
  t.true((await sh.exists(__dirname + '/junk/existsTest')), 'existsTest should exist')
  t.false((await sh.exists(__dirname + '/junk/existsTestExceptNot')), 'existsTestExceptNot should not exist')
})
