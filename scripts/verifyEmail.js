/*
  use parse-email lib to verify an email with nodejs crypto
  used for testing
*/
const crypto = require("crypto");
const fs = require("fs");
const parseEmail = require("../parse-email/node");

const [, , path] = process.argv;

const verifyEmail = path => {
  return new Promise(async (resolve, reject) => {
    const email = fs.readFileSync(path, {
      encoding: "ascii"
    });

    const dkims = await parseEmail(email).catch(reject);

    const results = dkims.map((dkim, i) => {
      const verified = crypto
        .createVerify(dkim.algorithm)
        .update(dkim.processedHeader)
        .verify(dkim.publicKey, dkim.signature.signature);

      return { name: dkim.entry.name, verified };
    });

    return resolve(results);
  });
};

if (typeof path === "undefined") {
  throw Error("no path specified");
}

verifyEmail(path)
  .then(console.log)
  .catch(console.error);
