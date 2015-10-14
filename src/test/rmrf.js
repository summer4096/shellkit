import test from 'blue-tape'
import { exists, isDirectory, ls, isFile, rmrf, mkdir, touch } from '../'

const rmPath = __dirname + '/junk/rmrfTest'

async function testDir (t) {
  t.true((await exists(rmPath)), 'rmrfTest must exist')
  t.true((await isDirectory(rmPath)), 'rmrfTest must be a directory')
  t.deepEqual((await ls(rmPath)).sort(), ['1', '2', '3'], 'rmrfTest must contain stuff')
  t.deepEqual((await ls(rmPath + '/3')), ['4'], 'rmrfTest/3 must contain stuff')
  t.true((await isFile(rmPath + '/1')), 'rmrfTest/1 must be a file')
  t.true((await isFile(rmPath + '/2')), 'rmrfTest/2 must be a file')
  t.true((await isDirectory(rmPath + '/3')), 'rmrfTest/3 must be a directory')
  t.true((await isFile(rmPath + '/3/4')), 'rmrfTest/3/4 must be a file')
}

test('rm.recursive', async function (t) {
  await testDir(t)

  await rmrf(rmPath)

  t.false((await exists(rmPath)), 'rm.rf must recursively delete directories')

  await mkdir(rmPath)
  await mkdir(rmPath + '/3')
  await Promise.all([
    touch(rmPath + '/1'),
    touch(rmPath + '/2'),
    touch(rmPath + '/3/4')
  ])

  await testDir(t)
})
