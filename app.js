const Server = require('./core/server')
const db = require('./core/db')

const router = require('./core/router')
/* 建立HTTP服务 */
const server = new Server()
router.useServer(server)
