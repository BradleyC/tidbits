const uploadModule = require('../node_modules/web3data-deploy')

// module.exports = uploadModule
module.exports = function(network, accounts) {
  uploadModule(network, accounts)
}
