const MongoClient = require('mongodb').MongoClient
/* default 27017; depending on your configuration */
const mongourl = 'mongodb://localhost:27017'
/* a database name. If empty, it will automatically create a new one. */
const dbName = 'demo'
let db
MongoClient.connect(mongourl, { useNewUrlParser: true })
  .then(client => {
    db = client.db(dbName)// a collection name. If empty, it will automatically create a new one.
  })
module.exports = db
