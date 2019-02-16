pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";

contract ERC721Metadata is ERC721Enumerable, IERC721Receiver, nonspecIERC721Metadata {
    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenPoems;

    constructor () public {
        // this constructor is under construction
    }

    function tokenPoem(uint72 poem) external view returns (uint72) {
        require(_exists(tokenId), "yokmuş");
        return _tokenPoems[tokenId];
    }

    function _settokenPoem(uint tokenId, uint72 poem) internal {
        require(_exists(tokenId), "yokmuş");
        _tokenPoems[tokenId] = uri;
    }

    function _burn(address owner, uint256 tokenId) internal {
        super._burn(owner, tokenId);

        // Clear metadata (if any)
        if (bytes(_tokenPoems[tokenId]).length != 0) {
            delete _tokenPoems[tokenId];
        }
    }
}

contract nonspecIERC721Metadata is IERC721 {
    function tokenPoem(uint256 tokenId) external view returns (uint);
}