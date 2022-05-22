const { red } = require('kolorist')
const exitFn = (info) => {
  setTimeout(() => {
    console.log('\n')
    console.log(red(info))
    process.exit(1)
  }, 1000)
}

module.exports.exitFn = exitFn
