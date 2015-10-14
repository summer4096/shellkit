import test from 'blue-tape'
import * as sh from '../'

test('sleep', async function (t) {
  let start = process.hrtime()
  await sh.sleep(0.05)
  let elapsed = process.hrtime(start)
  t.equal(elapsed[0], 0, '50ms sleep should take less than 1s')
  t.true(Math.abs(elapsed[1] - 50000000) <= 2000000, '50ms sleep should not be off by more than 2ms')
})
