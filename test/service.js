const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const Service = artifacts.require("./Service.sol");
const parseEmail = require("../parse-email/node");
const { expectEvent, expectRevert } = require("../helpers/OpenZeppelin")(web3);

const readFile = promisify(fs.readFile);
const emailsPath = path.join(__dirname, "emails");
const recordsPath = path.join(__dirname, "records");

contract("service", accounts => {
  const [owner, oracle] = accounts;
  let service;

  before(async () => {
    service = (await Service.new(oracle)).contract;
  });

  context("oracle", async () => {
    it("should expect event 'LookupRecord'", async () => {
      const domain = "default._domainkey.example.com";

      const receipt = await service.methods.lookupRecord(domain).send({
        from: owner
      });

      await expectEvent(receipt, "LookupRecord", [domain]);
    });

    it("should set record", async () => {
      const domain = "20150623._domainkey.nonicorp-com.20150623.gappssmtp.com";
      const { exponent, modulus } = require(path.join(
        recordsPath,
        "gmail.json"
      ));

      await expectRevert(
        service.methods.setRecord(domain, exponent, modulus).send({
          from: owner,
          gas: 3000000
        }),
        "only the oracle is allowed to use this function"
      );
      await service.methods.setRecord(domain, exponent, modulus).send({
        from: oracle,
        gas: 3000000
      });

      const result = await service.methods.records(domain).call({
        from: owner
      });

      assert.isTrue(parseInt(result.exponent, 16) === parseInt(exponent, 16));
      assert.isTrue(modulus === result.modulus);
    });

    it("should remove record", async () => {
      const domain = "20150623._domainkey.nonicorp-com.20150623.gappssmtp.com";

      await expectRevert(
        service.methods.removeRecord(domain).send({
          from: owner,
          gas: 3000000
        }),
        "only the oracle is allowed to use this function"
      );
      await service.methods.removeRecord(domain).send({
        from: oracle,
        gas: 3000000
      });

      const result = await service.methods.records(domain).call({
        from: owner
      });

      assert.isTrue(result.exponent === null);
      assert.isTrue(result.modulus === null);
    });
  });

  context("verify()", async () => {
    it("should verify gmail", async () => {
      const domain = "selector1._domainkey.outlook.com";
      const email = await readFile(path.join(emailsPath, "outlook.eml"), {
        encoding: "ascii"
      });
      const results = await parseEmail(email);
      const parsed = results[0].solidity;

      await service.methods
        .setRecord(domain, parsed.exponent, parsed.modulus)
        .send({
          from: oracle,
          gas: 3000000
        });

      const verified = await service.methods
        .verify(parsed.algorithm, parsed.hash, parsed.signature, domain)
        .call({
          from: owner
        });

      assert.isTrue(verified);
    });
  });
});
