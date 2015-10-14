import test from 'blue-tape'
import { exists, mkdirp, isDirectory, rmrf } from '../'

test('mkdirp', async function (t) {
  let basePath = __dirname + '/junk/mkdirpTest'
  let mkdirpPath = basePath + '/1/2/3'

  t.false((await exists(basePath)), 'basePath must not exist to begin with')
  await mkdirp(mkdirpPath)
  t.true((await exists(mkdirpPath)), 'mkdirpPath must now exist')
  t.true((await isDirectory(mkdirpPath)), 'mkdirpPath must be a directory')
  await rmrf(basePath)
  t.false((await exists(basePath)), 'basePath must not exist anymore')
})
