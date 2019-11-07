const NodeRSA = require("node-rsa");

const publicKeyToComponents = publicKey => {
  const parsed = new NodeRSA(publicKey);

  const { e: exponent, n: modulus } = parsed.exportKey("components-public");

  return {
    exponent,
    modulus
  };
};

module.exports = publicKeyToComponents;
