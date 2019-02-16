const fs = require('fs')
const path = require('path')
const ImageRegistry = artifacts.require('./ImageRegistry.sol')

module.exports = async deployer => {
  deployer.deploy(ImageRegistry)
}
