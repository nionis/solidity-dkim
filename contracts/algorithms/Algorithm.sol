pragma solidity >0.4.23;

/**
* @dev An interface for contracts implementing a signing algorithm.
*/
interface Algorithm {
    /**
    * @dev Verifies a signature.
    * @param hash The hash of data that needs to be verified.
    * @param signature The signature to verify.
    * @param exponent The exponent of a public key.
    * @param modulus The modulus of a public key.
    * @return True if the signature is valid.
    */
    function verify(
        bytes32 hash,
        bytes calldata signature,
        bytes calldata exponent,
        bytes calldata modulus
    ) external view returns (bool);
}
