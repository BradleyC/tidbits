/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
require('dotenv').config()
const HDWalletProvider = require('truffle-hdwallet-provider')

// NOTE: Only required if not using localhost
const mnemonic = process.env.ETH_MNEMONIC || ''
const apiKey = process.env.INFURA_API_KEY || ''

module.exports = {
  // REF http://truffleframework.com/docs/advanced/configuration
  networks: {
    development: {
      address: '0xbf525A808049976832813F72a5E9c6CBeaAc1091',
      host: 'localhost',
      port: 8545,
      gas: 6000000,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://rinkeby.infura.io/v3/${apiKey}`
        ),
      network_id: 4,
      gas: 4500000,
      gasPrice: 50000000000,
      value: 0
    },
    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://ropsten.infura.io/v3/${apiKey}`
        ),
      network_id: 3
    }
  }
}
