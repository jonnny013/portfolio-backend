require('ts-node/register')
const config = require('./src/config/db.ts')

// for debug purposes
console.log({ config })

module.exports = config
