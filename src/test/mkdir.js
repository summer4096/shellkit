import test from 'blue-tape'
import { exists, mkdir, isDirectory, rmdir } from '../'

test('mkdir', async function (t) {
  let mkdirPath = __dirname + '/junk/mkdirTest'

  t.false((await exists(mkdirPath)), 'mkdirPath must not exist to begin with')
  await mkdir(mkdirPath)
  t.true((await exists(mkdirPath)), 'mkdirPath must now exist')
  t.true((await isDirectory(mkdirPath)), 'mkdirPath must be a directory')
  await rmdir(mkdirPath)
  t.false((await exists(mkdirPath)), 'mkdirPath must not exist anymore')
})
