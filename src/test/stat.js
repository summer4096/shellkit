import test from 'blue-tape'
import * as sh from '../'

test('stat', async function (t) {
  let statPath = __dirname + '/junk/statTest'
  let stat = await sh.stat(statPath)

  t.equal(typeof stat, 'object', 'stats must be an object')
  t.equal(stat.size, 0, 'stats file must have size of 0')
  t.true(stat.isFile(), 'should have correct return value for isFile()')
  t.false(stat.isDirectory(), 'should have correct return value for isDirectory()')
})
