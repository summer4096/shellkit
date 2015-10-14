import test from 'blue-tape'
import * as sh from '../'

test('env', async function (t) {
  t.equal(typeof sh.env, 'object', 'should be an object')
  t.equal(sh.env, process.env, 'should === process.env')
  t.deepEqual(sh.env, process.env, 'should deep equal process.env')
})
