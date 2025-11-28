// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 SlayerToken (ERC20)
 - Custom token for rewards
 - Owner can set a task minter (TaskManager) who can mint rewards
 - Initial supply to owner
*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SlayerToken is ERC20, Ownable {
    address public taskMinter;

    modifier onlyTaskMinter() {
        require(msg.sender == taskMinter, "Caller is not the task minter");
        _;
    }

    constructor(uint256 initialSupply) ERC20("SlayerToken", "SLAY") {
        _mint(msg.sender, initialSupply);
    }

    // Set the TaskManager as the minter (only owner can call)
    function setTaskMinter(address _taskMinter) external onlyOwner {
        taskMinter = _taskMinter;
    }

    // Mint function callable only by TaskManager
    function mintForTask(address to, uint256 amount) external onlyTaskMinter {
        _mint(to, amount);
    }
}