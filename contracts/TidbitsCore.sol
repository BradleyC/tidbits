pragma solidity ^0.5.0;

import "./Composable.sol";
import "./Accounts.sol";

contract TidbitsCore is Composable, Accounts {
    /* @dev INHERITANCE PATTERN
        This contract combines Composable with Accounts and adds core functions. 
        Composable rolls up contracts pertaining to ERC20, ERC721, and ERC998 (a tree with 
        three major branches).
        Accounts inheritance is TidbitsHelpers -> GasManager -> Accounts.
     */

    

    constructor () public {
        // this constructor is still under construction
    }
}