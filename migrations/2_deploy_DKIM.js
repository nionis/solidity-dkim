const RSASHA1 = artifacts.require("./RSASHA1.sol");
const RSASHA256 = artifacts.require("./RSASHA256.sol");
const DKIM = artifacts.require("./DKIM.sol");

module.exports = function(deployer) {
  deployer.deploy(RSASHA1);
  deployer.deploy(RSASHA256);

  deployer.link(RSASHA1, DKIM);
  deployer.link(RSASHA256, DKIM);
  deployer.deploy(DKIM);
};
