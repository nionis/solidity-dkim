pragma solidity ^0.5.8;

import "./DKIM.sol";

contract Service is DKIM {
  struct Record {
    bytes exponent;
    bytes modulus;
  }

  address public oracle;
  mapping (string => Record) public records;

  modifier onlyOracle() {
    require(msg.sender == oracle, "only the oracle is allowed to use this function");
    _;
  }

  event LookupRecord(
    string domain
  );

  constructor(address _oracle) public {
    oracle = _oracle;
  }

  function setRecord(
    string calldata domain,
    bytes calldata exponent,
    bytes calldata modulus
  ) external onlyOracle {
    records[domain] = Record(
      exponent,
      modulus
    );
  }

  function removeRecord(
    string calldata domain
  ) external onlyOracle {
    delete records[domain];
  }

  function lookupRecord(
    string calldata domain
  ) external {
    emit LookupRecord(domain);
  }

  function verifySelf(
    Algorithms algorithm,
    bytes32 hash,
    bytes calldata signature,
    bytes calldata exponent,
    bytes calldata modulus
  ) external view returns (bool) {
    return _verify(
      algorithm,
      hash,
      signature,
      exponent,
      modulus
    );
  }

  function verify(
    Algorithms algorithm,
    bytes32 hash,
    bytes calldata signature,
    string calldata domain
  ) external view returns (bool) {
    Record storage record = records[domain];
    require(record.modulus.length > 0, "domain record does not exist");

    return _verify(
      algorithm,
      hash,
      signature,
      record.exponent,
      record.modulus
    );
  }
}