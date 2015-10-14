# Shellkit

asynchronous unix shell commands for es6 and beyond

## Example

```javascript
import 'shellkit/global'

script(function* () {
  yield mkdirp('build/js')

  yield touch('build/js/bundle.js')

  for (let file of yield ls('src')) {
    if (file.slice(-3) === '.js') {
      yield cat(`src/${file}`).appendTo('build/js/bundle.js')
    }
  }

  if ((yield exec('gzip -k build/js/bundle.js').code) !== 0) {
    echo('Failed to gzip bundle/js/bundle.js')
    exit(1)
  }
})
```

## Install

```console
npm install shellkit
```

## Global vs local

Import `shellkit/global` if you want it to pollute your global namespace.

```javascript
import 'shellkit/global'

script(/* ... */)
```

Otherwise you can do this:

```javascript
import * as sh from 'shellkit'

sh.script(/* ... */)
```

## API

* **spawn**(*String*: command, *Array*: args [, *Object*: options]) => *Promise*
* **exec**\`interpolated ${command}\` => *Promise*
* **parallel**(...*Promises*) => *Promise*
* **echo**(...*Mixed*)
* **exit**(*Number*: code)
* **ls**(*String*: directory) => *Promise* => *Array[String]*
* **mv**(*String*: source, *String*: dest) => *Promise*
* **writeFile**(*String*: path, *String|Buffer*: data [, *Object*: options]) => *Promise*
* **appendFile**(*String*: path, *String|Buffer*: data [, *Object*: options]) => *Promise*
* **exists**(*String*: path) => *Promise* => *Boolean*
* **rm**(*String*: path) => *Promise*
* **rmrf**(*String*: path) => *Promise*
* **rmdir**(*String*: path) => *Promise*
* **chown**(*String*: path, *Octal*: uid, *Octal*: gid) => *Promise*
* **chmod**(*String*: path, *Octal*: uid, *Octal*: gid) => *Promise*
* **stat**(*String*: path) => *Promise*
* **lstat**(*String*: path) => *Promise*
* **mkdir**(*String*: path [, *Octal*: mode=0777]) => *Promise*
* **mkdirp**(*String*: path [, *Octal*: mode=0777]) => *Promise*
* **uptime**() => *Number*: uptime in seconds
* **loadavg**() => *Array[Number]*
* **open**(*String*: path, *String*: flags [, *Octal*: mode]) => *Promise* => *Number*: fd
* **close**(*Number*: fd) => *Promise*
* **touch**(*String*: path) => *Promise*
* **isFile**(*String*: path) => *Promise* => *Boolean*
* **isDirectory**(*String*: path) => *Promise* => *Boolean*
* **isBlockDevice**(*String*: path) => *Promise* => *Boolean*
* **isCharacterDevice**(*String*: path) => *Promise* => *Boolean*
* **isSymbolicLink**(*String*: path) => *Promise* => *Boolean*
* **isFIFO**(*String*: path) => *Promise* => *Boolean*
* **isSocket**(*String*: path) => *Promise* => *Boolean*
* **cat**(...*Strings*: paths) => *Stream & Promise* using as a promise will resolve with the complete file contents, but you can also pipe
* **cd**(*String*: path)
* **cwd**() => *String*: path
* **env** *Object*: same as `process.env`
* **cp**(*String*: source, *String*: destination [, *Object*: opts]) => *Promise*
* **tmpfile**([*String*: extension [, *String*: basedir]]) => *Promise* => *String*: path
* **tmpdir**([*String*: parentDirectory]) => *Promise* => *String*: path
* **sleep**(*Number*: seconds) => *Promise* resolves when X seconds have passed
* **stream**(*Stream*: original) => *Stream & Promise* using as a promise will resolve with the complete output, but you can also pipe
* **script**(*Async Function | Generator*: fn) runs the given function and handles any errors

## License

MIT
