/*
  parse and return email data
  (browser)
*/
const Hashes = require("jshashes");
const parse = require("./parse");
const toSolidity = require("./utils/toSolidity");
const publicKeyToComponents = require("./utils/publicKeyToComponents");

const main = email => {
  return new Promise(async (resolve, reject) => {
    // get dkims
    const dkims = parse(email).dkims.map(dkim => {
      const algorithm = dkim.algorithm
        .split("-")
        .pop()
        .toUpperCase();

      const hash = new Hashes[algorithm]().hex(dkim.processedHeader);

      return {
        ...dkim,
        hash
      };
    });

    // get dns records
    const publicKeys = await fetch("/api/getPublicKeys", {
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      referrer: "no-referrer",
      body: JSON.stringify(
        dkims.map(dkim => ({
          domain: dkim.signature.domain,
          selector: dkim.signature.selector
        }))
      )
    })
      .then(res => res.json())
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
