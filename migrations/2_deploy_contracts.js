// const GasAndAccountManager = artifacts.require('./contracts/GasAndAccountManager.sol')
const TidbitsCore = artifacts.require('./contracts/TidbitsCore.sol')
const TidbitsHelpers = artifacts.require('./contracts/TidbitsHelpers.sol')
const ERC20 = artifacts.require('./contracts/ERC20.sol')

module.exports = async deployer => {
  await deployer.deploy(TidbitsHelpers)
  // console.log('Contract address:', c.address)
  
  await deployer.deploy(ERC20)
  await deployer.deploy(TidbitsCore, 30, 5000)
  // await deployer.deploy(GasAndAccountManager, 30, 5000)
  
  // deployer.link(GasAndAccountManager, [TidbitsCore])

}
