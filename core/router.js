const worker = require('./worker')

const routers = [
  {
    path: '/greet',
    method: 'POST',
    callback (req, res, bufferConCat) {
      const payload = JSON.parse(bufferConCat.toString())
      res.writeHeader(200, {'Content-Type': 'application/json;charset=UTF-8'})
      res.write(JSON.stringify({
        'greet': `Hello, ${payload.name.trim()} !`,
        'luckNum': (Math.random() * 10).toFixed(0)
      }))
      res.end()
    }
  },
  {
    path: '/cpu',
    method: 'GET',
    callback (req, res) {
      res.writeHeader(200, {'Content-Type': 'application/json;charset=UTF-8'})
      res.write(JSON.stringify(worker.getCPUs()))
      res.end()
    }
  },
  {
    path: '/readWorkDir',
    method: 'GET',
    callback (req, res) {
      res.writeHeader(200, {'Content-Type': 'application/json;charset=UTF-8'})
      worker.readDir().then(data => {
        res.write(JSON.stringify(data))
        res.end()
      })
    }
  }
]
module.exports = {
  useServer (server) {
    server.use(routers)
  }
}
