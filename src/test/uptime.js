import test from 'blue-tape'
import * as sh from '../'

test('uptime', async function (t) {
  let uptime = sh.uptime()
  t.equal(typeof uptime, 'number', 'should be a number')
  t.equal(uptime % 1, 0, 'should be an integer')
  t.ok(uptime >= 0, 'should be greater than or equal to zero')
})
