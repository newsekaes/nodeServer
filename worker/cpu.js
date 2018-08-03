const os = require('os')
let priviousCpus
let tick
let cpusUsage = [];
(function () {
  fresh()
  setInterval(() => {
    cupsloyd()
  }, 500)
  function cupsloyd () {
    const cpus = os.cpus()
    const t = new Date().getTime() - tick
    cpusUsage = cpus.map(({ times }, i) => {
      const usage = {}
      Object.entries(times).forEach(([key, value]) => {
        usage[key] = (value - priviousCpus[i].times[key]) / t
      })
      return usage
    })
    fresh()
  }
  function fresh () {
    priviousCpus = os.cpus()
    tick = new Date().getTime()
  }
})()
module.exports = {
  get percent () {
    return cpusUsage
  }
}
