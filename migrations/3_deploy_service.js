const RSASHA1 = artifacts.require("./RSASHA1.sol");
const RSASHA256 = artifacts.require("./RSASHA256.sol");
const Service = artifacts.require("./Service.sol");

module.exports = function(deployer, network, accounts) {
  const oracleAddress = accounts[1]; // temporary oracle address

  deployer.deploy(RSASHA1);
  deployer.deploy(RSASHA256);

  deployer.link(RSASHA1, Service);
  deployer.link(RSASHA256, Service);
  deployer.deploy(Service, oracleAddress);
};
