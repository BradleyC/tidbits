pragma solidity ^0.5.0;

import "./GasManager.sol";

contract Accounts is GasManager {
    /* @dev this contract will become a re-usable template for management of 
    Canopy style accounts. We get gas from  */

    address[] public registeredUsers;
    mapping (address => bool) registrationIndex;

    function registerUser(address payable _newUser) public onlyRequestor returns (bool success) {
        registeredUsers.push(_newUser);
        registrationIndex[_newUser] = true;
        payUser(_newUser, baseGasProvision);
        emit newUser(_newUser);
        return true;
    }

    function getRegisteredUsers() public view returns (address[] memory users) {
        return registeredUsers;
    }

    event newUser(address user);

    constructor () public {
        // this constructor is still under construction
    }
}