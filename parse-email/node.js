/*
  parse and return email data
  (nodejs)
*/
const crypto = require("crypto");
const parse = require("./parse");
const getPublicKey = require("./utils/getPublicKey");
const publicKeyToComponents = require("./utils/publicKeyToComponents");
const toSolidity = require("./utils/toSolidity");

const main = email => {
  return new Promise(async (resolve, reject) => {
    // get dkims
    const dkims = parse(email).dkims.map(dkim => {
      const algorithm = dkim.algorithm
        .split("-")
        .pop()
        .toUpperCase();

      const bodyHashMatched =
        new crypto.createHash(algorithm)
          .update(dkim.processedBody)
          .digest()
          .compare(dkim.signature.hash) !== 0;

      if (bodyHashMatched) {
        return reject("body hash did not verify");
      }

      const hash = crypto
        .createHash(algorithm)
        .update(dkim.processedHeader)
        .digest();

      return {
        ...dkim,
        hash
      };
    });

    // get dns records
    const publicKeys = await Promise.all(
      dkims.map(dkim =>
        getPublicKey({
          domain: dkim.signature.domain,
          selector: dkim.signature.selector
        })
      )
    )
      .then(entries => {
        return entries.map(entry => {
          const { publicKey } = entry;
          const { exponent, modulus } = publicKeyToComponents(publicKey);

          return {
            ...entry,
            exponent,
            modulus
          };
        });
      })
      .catch(reject);

    return resolve(
      dkims.map((dkim, i) => {
        const solidity = toSolidity({
          algorithm: dkim.algorithm,
          hash: dkim.hash,
          signature: dkim.signature.signature,
          exponent: publicKeys[i].exponent,
          modulus: publicKeys[i].modulus
        });

        return {
          ...dkim,
          ...publicKeys[i],
          solidity
        };
      })
    );
  });
};

module.exports = main;
