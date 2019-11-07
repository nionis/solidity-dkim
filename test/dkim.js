const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const DKIM = artifacts.require("./DKIM.sol");
const parseEmail = require("../parse-email/node");

const readFile = promisify(fs.readFile);
const emailsPath = path.join(__dirname, "emails");

contract("DKIM", accounts => {
  const [owner] = accounts;
  let dkim;

  before(async () => {
    dkim = (await DKIM.new()).contract;
  });

  context("verify()", async () => {
    it("should be below 3 million gas", async () => {
      const email = await readFile(path.join(emailsPath, "outlook.eml"), {
        encoding: "ascii"
      });
      const results = await parseEmail(email);
      const parsed = results[0].solidity;

      const result = await dkim.methods
        .verify(
          parsed.algorithm,
          parsed.hash,
          parsed.signature,
          parsed.exponent,
          parsed.modulus
        )
        .send({
          from: owner
        });

      assert.isTrue(result.gasUsed < 3e9);
    });

    it("should verify gmail", async () => {
      const email = await readFile(path.join(emailsPath, "gmail.eml"), {
        encoding: "ascii"
      });
      const results = await parseEmail(email);
      const parsedDkim = results[0].solidity;
      const parsedGDkim = results[1].solidity;

      const verified = await dkim.methods
        .verify(
          parsedDkim.algorithm,
          parsedDkim.hash,
          parsedDkim.signature,
          parsedDkim.exponent,
          parsedDkim.modulus
        )
        .call({
          from: owner
        });

      assert.isTrue(verified);

      const gVerified = await dkim.methods
        .verify(
          parsedGDkim.algorithm,
          parsedGDkim.hash,
          parsedGDkim.signature,
          parsedGDkim.exponent,
          parsedGDkim.modulus
        )
        .call({
          from: owner
        });

      assert.isTrue(gVerified);
    });

    it("should verify icloud", async () => {
      const email = await readFile(path.join(emailsPath, "icloud.eml"), {
        encoding: "ascii"
      });
      const results = await parseEmail(email);
      const parsed = results[0].solidity;

      const verified = await dkim.methods
        .verify(
          parsed.algorithm,
          parsed.hash,
          parsed.signature,
          parsed.exponent,
          parsed.modulus
        )
        .call({
          from: owner
        });

      assert.isTrue(verified);
    });

    it("should verify outlook", async () => {
      const email = await readFile(path.join(emailsPath, "outlook.eml"), {
        encoding: "ascii"
      });
      const results = await parseEmail(email);
      const parsed = results[0].solidity;

      const verified = await dkim.methods
        .verify(
          parsed.algorithm,
          parsed.hash,
          parsed.signature,
          parsed.exponent,
          parsed.modulus
        )
        .call({
          from: owner
        });

      assert.isTrue(verified);
    });

    it("should verify protonmail", async () => {
      const email = await readFile(path.join(emailsPath, "protonmail.eml"), {
        encoding: "ascii"
      });
      const results = await parseEmail(email);
      const parsed = results[0].solidity;

      const verified = await dkim.methods
        .verify(
          parsed.algorithm,
          parsed.hash,
          parsed.signature,
          parsed.exponent,
          parsed.modulus
        )
        .call({
          from: owner
        });

      assert.isTrue(verified);
    });

    it("should verify yahoo", async () => {
      const email = await readFile(path.join(emailsPath, "yahoo.eml"), {
        encoding: "ascii"
      });
      const results = await parseEmail(email);
      const parsed = results[0].solidity;

      const verified = await dkim.methods
        .verify(
          parsed.algorithm,
          parsed.hash,
          parsed.signature,
          parsed.exponent,
          parsed.modulus
        )
        .call({
          from: owner
        });

      assert.isTrue(verified);
    });
  });
});
