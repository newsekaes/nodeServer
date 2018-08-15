const http = require('http')
const URL = require('url')
module.exports = class Server {
  constructor () {
    this.queue = {
      get: {},
      post: {}
    }
    const server = http.createServer((req, res) => {
      /* resolve cross-domain */
      req.headers.origin && res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      const url = getUrl(req.url)
      const param = URL.parse(req.url).query
      if (url === '/') {
        res.writeHeader(200, {'Content-Type': 'text/html;charset=UTF-8'})
        res.write(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Index</title></head><body><h1>Hello World</h1></body>`)
        res.end()
      } else if (!this.queue.post[url] && !this.queue.get[url]) {
        notFound(req, res)
      } else {
        switch (req.method) {
          case 'POST':
            const chunks = []
            let size = 0
            let bufferConcat
            req.on('data', chunk => {
              chunks.push(chunk)
              size += chunk.length
            })
            req.on('end', () => {
              bufferConcat = Buffer.concat(chunks, size)
              this.queue.post[url].call(null, req, res, bufferConcat, param)
            })
            break
          case 'GET':
            this.queue.get[url].call(null, req, res, param)
            break
          case 'OPTIONS':
            res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
            res.end()
            break
          /* for other methods */
        }
      }
    })
    server.on('listening', () => {
      console.log('Server running on port 9090 ...')
    })
    server.listen({port: 9090})
    function notFound (req, res) {
      res.writeHeader(200, {'Content-Type': 'text/plain;charset=UTF-8'})
      res.write(`404: ${req.url} is not found in router`)
      res.end()
    }
  }

  /**
   * get请求的归列
   * @param url
   * @param callback
   */
  get (url, callback) {
    this.queue.get[getUrl(url)] = callback
  }

  /**
   * post请求的归列
   * @param url
   * @param callback
   */
  post (url, callback) {
    this.queue.post[getUrl(url)] = callback
  }

  /**
   * 批量绑定路由
   * @param routerArray
   */
  use (routerArray) {
    routerArray.forEach(router => {
      this[router.method.toLowerCase()](router.path, router.callback)
    })
  }
}

/**
 * 格式化url地址为 '/name' 的形式
 * @param url
 * @returns {*}
 */
function getUrl (url) {
  return url.replace(new RegExp('^(/?)(.*[^/])?(/?)$'), function (match, p1, p2) {
    return p1 + (p2 || '')
  })
}
