import { Stream } from 'stream'
import fs from 'fs'

export default function stream (original) {
  if (!(original instanceof Stream)) {
    throw new Error("That isn't a stream, bro.")
  }

  let firstTickError
  original.once('error', err => firstTickError = err)

  if (original instanceof Stream.Readable) {
    if (typeof original.then !== 'function') {
      let p
      let mkp = () => {
        if (typeof p !== 'undefined') return p

        p = new Promise((resolve, reject) => {
          if (firstTickError) {
            reject(firstTickError)
            return
          }

          let data = []
          let streamType = 'empty'
          let bufferLength = 0

          let ended = false

          original.on('data', chunk => {
            if (ended) {
              console.log('write after end', chunk)
            }
            if (original._readableState.objectMode) {
              streamType = 'object'
              data.push(chunk)
            } else if (typeof chunk === 'string') {
              streamType = 'string'
              data.push(chunk)
            } else if (chunk instanceof Buffer) {
              streamType = 'buffer'
              bufferLength += chunk.length
              data.push(chunk)
            } else {
              throw new Error(`invalid chunk in stream ${typeof chunk} ${chunk}`)
            }
          })

          original.on('error', err => reject(err))

          original.on('end', () => {
            ended = true
            if (streamType === 'buffer') {
              resolve(Buffer.concat(data, bufferLength).toString())
            } else if (streamType === 'string') {
              resolve(data.join(''))
            } else if (streamType === 'empty') {
              resolve(original._readableState.objectMode ? [] : '')
            }
          })
        })

        return p
      }

      original.then = (...args) => mkp().then(...args)
      original.catch = (...args) => mkp().catch(...args)
      original.completion = new Promise((resolve, reject) => {
        original.on('error', reject)
        original.on('end', resolve)
      })

      let oldPipe = original.pipe.bind(original)
      original.pipe = (dest, opts) => {
        opts = opts || {}
        dest = oldPipe(dest, opts)

        original.on('error', err => dest.emit('error', err))
        if (firstTickError) dest.emit('error', firstTickError)

        let str = stream(dest)
        if (opts.end === false) {
          str = original
        }

        return str
      }
      original.to = (dest, opts) => {
        dest = fs.createWriteStream(dest, opts)
        return original.pipe(dest, opts)
      }
      original.appendTo = (dest, opts) => {
        opts = opts || {}
        opts.flags = 'a'
        return original.to(dest, opts)
      }
    }
  } else if (original instanceof Stream.Writable) {
    if (typeof original.then !== 'function') {
      let p
      let mkp = () => {
        if (typeof p !== 'undefined') return p

        p = new Promise((resolve, reject) => {
          if (firstTickError) {
            reject(firstTickError)
            return
          }

          original.on('error', err => reject(err))
          original.on('close', () => resolve())
        })

        return p
      }

      original.then = (...args) => mkp().then(...args)
      original.catch = (...args) => mkp().catch(...args)
      original.completion = mkp()
    }
  } else {
    throw new Error('Expected a readable or writable stream')
  }

  return original
}
