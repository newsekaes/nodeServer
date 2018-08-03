const EventEmitter = require('events')
const fork = require('child_process').fork
const IN_DEBUG = process.execArgv.some(arg => arg.indexOf('--inspect-brk') >= 0)
const worker = fork('./worker/index.js', {
  execArgv: process.execArgv.concat(IN_DEBUG ? [`--inspect-brk=${process.debugPort + 1}`] : [])
})
const workEvent = new EventEmitter()
const storage = {
  cpus: null
}
const workerHandler = {
  greet (msg) {
    console.log(`来自子程序的消息：${msg}`)
  },
  cpu (data) {
    storage.cpus = data
  },
  readDir (data) {
    workEvent.emit(`read_dir.${data.tick}`, data.result)
  }
}
worker.on('message', function ({type = null, msg = null}) {
  type && workerHandler[type](msg)
})
setInterval(() => {
  worker.send({ type: 'cpu' })
}, 1000)
module.exports = {
  getCPUs () {
    return storage.cpus
  },
  readDir () {
    return new Promise(resolve => {
      const tick = new Date().getTime()
      worker.send({ type: 'readDir', msg: tick })
      workEvent.once(`read_dir.${tick}`, data => resolve(data))
    })
  }
}
