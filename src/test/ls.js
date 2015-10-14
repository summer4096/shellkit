import test from 'blue-tape'
import * as sh from '../'

test('ls', async function (t) {
  let list = await sh.ls(__dirname + '/junk')

  t.ok(Array.isArray(list), 'should return an array')
  t.notEqual(list.indexOf('mvTest'), -1, 'return value should include mvTest')
})
