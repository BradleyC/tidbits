pragma solidity ^0.5.0;

import "./GasAndAccountManager.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract TidbitsCore is GasAndAccountManager, ERC20 {
    string public name = "Tidbit";
    string public symbol = "TDBT";
    // who even wants to count pennies anyway!?!
    uint8 public decimals = 0;
    uint public INITIAL_SUPPLY = 666666666666;

    struct Lyric {
        uint256 parentLyric;
        // using line number of words from BIP-39 set as index, concat into integer
        uint128 lyrics;
        address lyricOwner;
    }

    Lyric[] public lyrics;
    uint256 public totalLyrics;
    mapping (address => uint256[]) addressToLyrics;
    mapping (uint256 => address) lyricToAddress;

    // create
    function createLyric(uint256 _parentLyric, uint128 _lyrics) public payable {
        uint256 startGas = gasleft();
        address payable sender = msg.sender;
        Lyric memory lyric = Lyric({
            parentLyric: _parentLyric,
            lyrics: _lyrics,
            lyricOwner: sender
        });
        totalLyrics = lyrics.push(lyric) - 1;
        addressToLyrics[sender].push(totalLyrics);
        lyricToAddress[totalLyrics] = sender;
        emit newLyric(totalLyrics, _parentLyric, _lyrics, sender);
        transfer(address(this), 5);
        registerActionAndPassGas(1, startGas, 0, sender); 
    }

    event newLyric(uint256 lyricId, uint256 parentLyric, uint128 lyrics, address lyricOwner);

    function getLyricsByAddress(address _address) public view returns (uint256[] memory) {
        return addressToLyrics[_address];
    }

    constructor () public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}