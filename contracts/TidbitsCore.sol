pragma solidity ^0.5.0;

// import "./GasAndAccountManager.sol";
import "./ERC20.sol";
import "./TidbitsHelpers.sol";

contract TidbitsCore is ERC20, TidbitsHelpers {
    struct Lyric {
        uint256 parentLyric;
        // using line number of words from BIP-39 set as index, concat into integer
        uint128 lyrics;
        address lyricOwner;
    }

    Lyric[] public lyricList;
    uint256 public totalLyrics;
    mapping (address => uint256[]) addressToLyrics;
    mapping (uint256 => address) lyricToAddress;

    function createLyric(uint256 _parentLyric, uint128 _lyrics) public payable {
        uint256 startGas = gasleft();
        address payable _sender = msg.sender;
        Lyric memory lyric = Lyric({
            parentLyric: _parentLyric,
            lyrics: _lyrics,
            lyricOwner: _sender
        });
        totalLyrics = lyricList.push(lyric) - 1;
        addressToLyrics[_sender].push(totalLyrics);
        lyricToAddress[totalLyrics] = _sender;
        emit newLyric(totalLyrics, _parentLyric, _lyrics, _sender);
        ERC20.transfer(address(this), 5);
        registerActionAndPassGas(uint256(1), startGas, uint256(0), _sender); 
    }

    event newLyric(uint256 lyricId, uint256 parentLyric, uint128 lyrics, address lyricOwner);

    function getLyricsByAddress(address _address) public view returns (uint256[] memory) {
        return addressToLyrics[_address];
    }

    /* Method to receive transaction */
    function receiveVerification(address _contract, uint256 amount) public {
        require(registeredApplications[_contract] == true, "verification without registration is meaningless");
        contractGasReserve = contractGasReserve + amount;
    }

    /* @dev GasAndAccountManager .
        Intended to be a standalone contract, but migration trouble and time constraints
        require a long and dirty file for now. */

    uint256 public maxBatchDepth;
    uint256 public stackDepth;
    uint256 public baseGasProvision;
    uint256 public contractGasReserve;

    address[] public gasManagedContracts;
    address[] public registeredUsers;
    mapping (address => bool) registrationIndex;
    mapping (address => bool) registeredApplications;
    mapping (uint256 => uint256) public actionToCount;
    mapping (uint256 => uint256) public actionToGasCost;
    
    function registerUser(address payable _newUser) public onlyRegisteredApplication returns (bool success) {
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

    struct Action {
        uint256 actionId;
        uint256 gasCost;
    }

    Action[] public actions;

    function registerActionAndPassGas(
        uint256 action, 
        uint256 gas,
        uint256 gasProvision, 
        address payable gasUser
        ) public onlyRegisteredApplication returns (bool success) {
        uint256 gasP;
        Action memory a = Action({
            actionId: action,
            gasCost: gas
        });
        if (gasProvision == 0) {
            gasP = baseGasProvision;
        } else {
            gasP = gasProvision;
        }
        require(registrationIndex[gasUser] == true, "can't pay you if we don't know you");
        actions.push(a);
        updateStack();
        payUser(gasUser, gasP);        
        return success;
    }

    function payUser(address payable user, uint256 value) private {
        uint256 balance = contractGasReserve;
        if (value == 0) {
            value = baseGasProvision;
        }
        require(balance > value, "this chain has run out of funds. please contact your admin.");
        user.transfer(value);
        contractGasReserve = balance - value;
    }

    event currentGas(uint256 balance);

    function updateStack() private {
        stackDepth = actions.length;
        emit currentStackDepth(stackDepth);
        if (stackDepth >= maxBatchDepth) {
            emit stackDepthWarning(true);
        } 
    }

    event currentStackDepth(uint256 stackDepth);
    event stackDepthWarning(bool warning);

    function finalizeBatch() public onlyRegisteredApplication returns(uint256, uint256) {
        Action[] memory batch = actions;
        uint256 totalGas;
        uint256 totalActions;
        for (uint256 i = 0; i < batch.length; i++) {
            totalActions++;
            totalGas = totalGas + batch[i].gasCost;
        }
        emit batchClosed(totalActions, totalGas);
        actions.length = 0;
        return (totalActions, totalGas);
    }

    event batchClosed(uint256 totalActions, uint256 totalGas);

    function registerApplication(address registeredApplication) public returns (bool success) {
        require(signers[msg.sender] == true, "only the elect may add a registered application");
        registeredApplications[registeredApplication] = true;
        return true;
    }

    modifier onlyRegisteredApplication {
        require (registeredApplications[msg.sender] == true, "this interface is available to registered applications only");
        _;
    }

    function registerCompanionContract(address gasManagedAddress) public returns (bool success) {
        gasManagedContracts.push(gasManagedAddress);
        return true; 
    }

    function getgasManagedContracts() public view returns (address[] memory) {
        return gasManagedContracts;
    }

    constructor(uint256 batchDepth, uint256 gasProvision) public {
        maxBatchDepth = batchDepth;
        baseGasProvision = gasProvision;
        address owner = msg.sender;
        owners[owner] = true;
    }
}