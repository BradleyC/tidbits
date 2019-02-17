const ERC998 = artifacts.require('./contracts/ERC998.sol')
const nonspec = artifacts.require('./contracts/nonspecERC721.sol')

module.exports = async deployer => {
  // deploy core contract
  await deployer.deploy(ERC998)
  // console.log('Contract address:', c.address)

  // link dependencies
  deployer.link(ERC998, [nonspec])

  // deploy dependencies
  await deployer.deploy(nonspec)