pragma solidity ^0.5.8;

import "./algorithms/RSASHA1.sol";
import "./algorithms/RSASHA256.sol";

contract DKIM {
  enum Algorithms {
    RSASHA1,
    RSASHA256
  }

  function _verify(
    Algorithms algorithm,
    bytes32 hash,
    bytes memory signature,
    bytes memory exponent,
    bytes memory modulus
  ) internal view returns (bool) {
    if (algorithm == Algorithms.RSASHA1) {
      return RSASHA1.verify(
        hash,
        signature,
        exponent,
        modulus
      );
    } else if (algorithm == Algorithms.RSASHA256) {
      return RSASHA256.verify(
        hash,
        signature,
        exponent,
        modulus
      );
    }

    revert("signing algorithm is not supported");
  }

  function verify(
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
}