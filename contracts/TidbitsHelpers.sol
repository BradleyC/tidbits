pragma solidity ^0.5.0;

contract TidbitsHelpers {
    // owners have all permissions
    mapping (address => bool) owners;
    address[] ownerList;
    // signers can do many admin functions, but generally not touch the 💰
    mapping (address => bool) signers;
    address[] signerList;

    function addToOwners(address newOwner) public onlyOwner(newOwner) {
        owners[newOwner] = true;
        ownerList.push(newOwner);
    }

    function addToSigners(address newSigner) public onlyOwner(newSigner) {
        signers[newSigner] = true;
        signerList.push(newSigner);
    }

    constructor () public {
        address owner = msg.sender;
        owners[owner] = true;
        ownerList.push(owner);
        signers[owner] = true;
        signerList.push(owner);
    }

    function getOwners() public view returns (address[] memory pwners) {
        return ownerList;
    }

    function getSigners() public view returns (address[] memory signores) {
        return signerList;
    }

    modifier onlyOwner(address _address) {
        require (owners[_address] == true, "you do not pass the test of power!");
        _;
    }

    modifier onlySigner(address _address) {
        require (signers[_address] == true, "you are strong yet still do not pass the test of power!");
        _;
    }
}