const Market = artifacts.require("Market");

module.exports = function(deployer) {
  deployer.deploy(Market);
};
