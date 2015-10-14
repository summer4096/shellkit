import test from 'blue-tape'
import * as sh from '../'

const catPath = __dirname + '/junk/catTest'
const catMultiPath = __dirname + '/junk/catMultiTest'
const emptyPath = __dirname + '/junk/catEmptyTest'

test('cat .then', async function (t) {
  t.equal((await sh.cat(catPath)), 'Hello, World!\n', 'should return file contents')
})

test('cat .then (empty file)', async function (t) {
  t.equal((await sh.cat(emptyPath)), '', 'should return empty file contents')
})

test('cat stream', async function (t) {
  let fileContents = await new Promise((resolve, reject) => {
    let data = ''
    sh.cat(catPath)
      .on('error', reject)
      .on('data', chunk => data += chunk)
      .on('end', () => resolve(data))
  })
  t.equal(fileContents, 'Hello, World!\n', 'should provide stream interface')
})

test('cat non-existent', async function (t) {
  let err = await sh.cat(__dirname + '/junk/catTest-nonexistent')
    .then(() => t.fail('failed to throw when trying to cat non-existent file'))
    .catch(err => err)
  t.true(err instanceof Error, 'should throw an error when trying to cat non-existent file')
  t.equal(err.code, 'ENOENT', 'should throw an ENOENT when trying to cat non-existent file')
})

test('cat multiple files', async function (t) {
  t.equal((await sh.cat(catPath, catMultiPath)), 'Hello, World!\nGoodbye, World!\n', 'should return all file contents')
})
