pragma solidity ^0.5.0;

import "./ERC998.sol";
import "./Accounts.sol";

contract TidbitsCore is ComposableTopDown, Accounts {
    /* @dev INHERITANCE PATTERN
        This contract interacts heavily with an external gas and account manager contract.
        
     */
    
    // wrapper for state changing functions - call them and then register with GasMan
    // create token
    // append to parent

    constructor (address gam) public {
    }
}