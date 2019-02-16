pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20burnable.sol";
import "./ERC998.sol";

contract Composable is ERC721Enumerable, ERC20Burnable, ERC998 {

    constructor () public {
        // this constructor is still under construction
    }
}