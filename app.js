const Server = require('./core/server')
// const db = require('./core/db')
const server = new Server()

server.post('/greet', function (req, res, bufferConCat) {
  const payload = JSON.parse(bufferConCat.toString())
  res.writeHeader(200, {'Content-Type': 'application/json;charset=UTF-8'})
  res.write(JSON.stringify({
    'greet': `Hello, ${payload.name.trim()} !`,
    'luckNum': (Math.random() * 10).toFixed(0)
  }))
  res.end()
})
