import test from 'blue-tape'
import * as sh from '../'

test('cp', async function (t) {
  let junkDir = __dirname + '/junk'

  let cpTestSrc = junkDir + '/cpTest'
  let cpTestDest = junkDir + '/cpTest-copy'

  let cpEmptyTestSrc = junkDir + '/cpEmptyTest'
  let cpEmptyTestDest = junkDir + '/cpEmptyTest-copy'

  t.true((await sh.exists(cpTestSrc)), 'cpTest should exists')
  t.false((await sh.exists(cpTestDest)), 'cpTest-copy should not exist')
  await sh.cp(cpTestSrc, cpTestDest)
  t.true((await sh.exists(cpTestDest)), 'cpTest-copy should exist after cp finishes')
  t.equal((await sh.cat(cpTestDest)), 'Hello, World!\n', 'cpTest-copy should be intact')
  await sh.rm(cpTestDest)
  t.false((await sh.exists(cpTestDest)), 'cpTest-copy should not exist after it is deleted')

  t.true((await sh.exists(cpEmptyTestSrc)), 'cpEmptyTest should exists')
  t.false((await sh.exists(cpEmptyTestDest)), 'cpEmptyTest-copy should not exist')
  await sh.cp(cpEmptyTestSrc, cpEmptyTestDest)
  t.true((await sh.exists(cpEmptyTestDest)), 'cpEmptyTest-copy should exist after cp finishes')
  t.equal((await sh.cat(cpEmptyTestDest)), '', 'cpEmptyTest-copy should be empty')
  await sh.rm(cpEmptyTestDest)
  t.false((await sh.exists(cpEmptyTestDest)), 'cpEmptyTest-copy should not exist after it is deleted')
})
