pragma solidity >0.4.23;

import "../utils/Bytes.sol";
import "./RSAVerify.sol";

/**
* @dev Implements the RSASHA256 algorithm.
*/
library RSASHA256 {
  using BytesUtils for *;

  function verify(bytes32 hash, bytes calldata sig, bytes calldata exponent, bytes calldata modulus) external view returns (bool) {
    // Recover the message from the signature
    bool ok;
    bytes memory result;
    (ok, result) = RSAVerify.rsarecover(modulus, exponent, sig);

    // Verify it ends with the hash of our data
    return ok && hash == result.readBytes32(result.length - 32);
  }
}
