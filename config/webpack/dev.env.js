var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SIGNING_ENDPOINT: '"https://nwvrsami3g.execute-api.us-west-1.amazonaws.com/test"'
})
