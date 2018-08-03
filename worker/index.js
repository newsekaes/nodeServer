const cpu = require('./cpu')
const readDirDeep = require('./dirRead')
const handler = {
  'cpu': () => {
    process.send({type: 'cpu', msg: cpu.percent})
  },
  greet () {
    console.log('child process start...')
  },
  readDir (tick) {
    /* 异步深度读取目录示例 */
    readDirDeep(process.env.PWD).then(list => process.send({type: 'readDir', msg: {result: list, tick}}))
  }
}
function send ({type = null, msg = null}) {
  type && handler[type](msg)
}
process.on('message', send)
send({ type: 'greet' })
