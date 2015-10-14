import test from 'blue-tape'
import * as sh from '../'

test('loadavg', async function (t) {
  let loadavg = sh.loadavg()
  t.equal(typeof loadavg, 'object', 'should be of type object')
  t.true(Array.isArray(loadavg), 'should be an array')
  t.equal(loadavg.length, 3, 'should contain three elements')
  t.true(loadavg.every(item => typeof item === 'number' && item >= 0), 'should only contain numbers that are >= 0')
})
