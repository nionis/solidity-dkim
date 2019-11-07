const OpenZeppelin = web3 => {
  if (!global.once) {
    require("openzeppelin-test-helpers/configure")({ web3 });
    global.once = true;
  }
  const openzeppelin = require("openzeppelin-test-helpers");

  return openzeppelin;
};

module.exports = OpenZeppelin;
