const fs = require('fs')
const path = require('path')
function readDirDeep (dir) {
  const sortlist = { directories: [], files: [] }
  return deep(dir, sortlist).then(() => Promise.resolve(sortlist))
}
function deep (dirPath, list) {
  return read(dirPath).then(sort).then(form => {
    list.directories.push(...form.directories)
    list.files.push(...form.files)
    if (form.directories.length > 0) {
      return Promise.all(form.directories.map(path => deep(path, list)))
    } else {
      return Promise.resolve('down')
    }
  })
}
function read (dirPath) {
  return new Promise(resolve => {
    fs.readdir(dirPath, 'utf8', function (err, data) {
      if (err) {
        console.error(err)
        resolve([])
      } else {
        resolve(data.map(d => path.resolve(dirPath, d)))
      }
    })
  })
}
function sort (data) {
  const form = {
    directories: [],
    files: []
  }
  const promiseList = data.map(d => {
    return new Promise(resolve => {
      fs.stat(d, (err, stats) => {
        resolve(err === null ? stats.isFile() : null)
      })
    })
  })
  return Promise.all(promiseList).then(result => {
    result.forEach((d, i) => {
      if (d !== null) {
        form[d ? 'files' : 'directories'].push(data[i])
      }
    })
    return Promise.resolve(form)
  })
}
module.exports = {
  readDirDeep
}
