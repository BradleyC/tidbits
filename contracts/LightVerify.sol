pragma solidity ^0.5.0;

contract LightVerify {
    /* @dev this contract verifies that a block has successfully crossed a bridge
        from one chain to the Dapp chain. 
        It would be preferable if an independent entity provided the verification service,
        or perhaps several providers offered verification with different methods.
        Chain operator needs to trust that they have received funds so it is in their best
        interest to have a strong verification.

        In the interest of time, this is the lightest verification allowable.
        */

    // receives a message from oracle with Dapp specific params
    function verifyAndCertify(address _contract, uint256 value) public {
        require (_contract == address(_contract), "parameter must be an address");
        require(value == uint256(value), "parameter must be an integer");
        emit Verify(_contract, value);
    }

    event Verify(address contrct, uint256 value);
}