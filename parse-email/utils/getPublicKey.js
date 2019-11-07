/*
  fetch domainkey record (nodejs)
*/
const { promisify } = require("util");
const getKey = promisify(require("dkim/lib/get-key"));

const getPublicKey = ({ domain, selector }) => {
  return getKey(domain, selector).then(key => {
    const publicKey =
      "-----BEGIN PUBLIC KEY-----\n" +
      key.key.toString("base64") +
      "\n-----END PUBLIC KEY-----";

    return {
      domain,
      selector,
      publicKey
    };
  });
};

module.exports = getPublicKey;
