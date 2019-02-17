const GasAndAccountManager = artifacts.require('./contracts/GasAndAccountManager.sol')
const TidbitsCore = artifacts.require('./contracts/TidbitsCore.sol')
const TidbitsHelpers = artifacts.require('./contracts/TidbitsHelpers.sol')

module.exports = async deployer => {
  await deployer.deploy(TidbitsHelpers)
  // console.log('Contract address:', c.address)

  deployer.link(TidbitsHelpers, [GasAndAccountManager])
  await deployer.deploy(GasAndAccountManager, 30, 5000)
  
  deployer.link(GasAndAccountManager, [TidbitsCore])

  await deployer.deploy(TidbitsCore)
}
