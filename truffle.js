const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          require("./mnemonic.json"),
          `https://rinkeby.infura.io/v3/${require("./infura.json")}`
        );
      },
      gasPrice: 1e9,
      network_id: 4
    }
  },
  solc: {
    version: "0.5.8",
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  mocha: {
    reporter: "eth-gas-reporter"
  }
};
