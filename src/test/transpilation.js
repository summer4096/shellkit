import test from 'blue-tape'
import glob from 'glob-promise'
import fs from 'fs-promise'
import path from 'path'

test('transpilation', async function (t) {
  let rootDir = path.join(__dirname, '../..')
  let sourceDir = path.join(rootDir, 'src')
  let distDir = path.join(rootDir, 'dist')
  let sources = await glob(__dirname + '/../../src/**/*.js')
  let stats = await Promise.all(sources.map(source => {
    let dist = path.join(distDir, source.substr(sourceDir.length + 1))
    return Promise.all([source, dist, fs.stat(source), fs.stat(dist)])
  }))
  stats.forEach(([source, dist, sourceStats, distStats]) => {
    t.ok(new Date(distStats.mtime) >= new Date(sourceStats.mtime), source.substr(sourceDir.length + 1) + ' should be transpiled and up to date')
  })
})
