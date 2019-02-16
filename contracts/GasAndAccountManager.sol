pragma solidity ^0.5.0;

import "./TidbitsHelpers.sol";

contract GasAndAccountManager is TidbitsHelpers {
    uint256 public maxBatchDepth;
    uint256 public stackDepth;
    uint256 public baseGasProvision;

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

    function registerAction(uint256 action) public onlyRegisteredApplication returns (bool success) {
        Action memory a = Action({
            actionId: action,
            gasCost: 0
        });
        actions.push(a);
        updateStack();
        return success;
    }

    function registerActionWithGasCost(uint256 action, uint256 gas) public onlyRegisteredApplication returns (bool success) {
        Action memory a = Action({
            actionId: action,
            gasCost: gas
        });
        actions.push(a);
        updateStack();
        return success;
    }

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
        uint256 balance = address(this).balance;
        if (value == 0) {
            value = baseGasProvision;
        }
        require(balance > value, "this chain has run out of funds. please contact your admin.");
        user.transfer(value);
        uint256 currentBalance = address(this).balance;
        emit currentGas(currentBalance);
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

    function registerRegisteredApplication(address registeredApplication) public returns (bool success) {
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