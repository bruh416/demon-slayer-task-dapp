// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 TaskManager
 - Users call markTaskDone() to register a completed task
 - TaskManager mints tokens (via SlayerToken.mintForTask) as reward
 - On reaching milestone threshold, TaskManager mints a SlayerBadge NFT for the user
 - Owner (deployer) can configure rewardPerTask and milestoneThreshold
*/

import "@openzeppelin/contracts/access/Ownable.sol";

interface ITaskToken {
    function mintForTask(address to, uint256 amount) external;
}

interface IBadge {
    function mintBadge(address to, string calldata tokenURI) external returns (uint256);
}

contract TaskManager is Ownable {
    ITaskToken public token;
    IBadge public badge;

    uint256 public rewardPerTask;      // token units (consider token has 18 decimals)
    uint256 public milestoneThreshold; // number of tasks to earn a badge

    mapping(address => uint256) public tasksCompleted;
    mapping(address => uint256) public badgesMinted;

    event TaskCompleted(address indexed user, uint256 newCount, uint256 rewardAmount);
    event MilestoneReached(address indexed user, uint256 milestoneCount, uint256 badgeId);

    constructor(address tokenAddress, address badgeAddress, uint256 _rewardPerTask, uint256 _milestoneThreshold) {
        token = ITaskToken(tokenAddress);
        badge = IBadge(badgeAddress);
        rewardPerTask = _rewardPerTask;
        milestoneThreshold = _milestoneThreshold;
    }

    // User-facing function: call when a user completes a task.
    // `badgeMetadataURI` can be an IPFS/Gist/HTTP link or empty string.
    function markTaskDone(string calldata badgeMetadataURI) external {
        tasksCompleted[msg.sender] += 1;
        uint256 newCount = tasksCompleted[msg.sender];

        // mint token reward to user
        token.mintForTask(msg.sender, rewardPerTask);
        emit TaskCompleted(msg.sender, newCount, rewardPerTask);

        // if user hits milestone, mint a badge
        if (newCount % milestoneThreshold == 0) {
            uint256 badgeId = badge.mintBadge(msg.sender, badgeMetadataURI);
            badgesMinted[msg.sender] += 1;
            emit MilestoneReached(msg.sender, newCount, badgeId);
        }
    }

    // Owner-only config functions
    function setRewardPerTask(uint256 newReward) external onlyOwner {
        rewardPerTask = newReward;
    }

    function setMilestoneThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold > 0, "threshold>0");
        milestoneThreshold = newThreshold;
    }

    // read helpers
    function getTasksCompleted(address user) external view returns (uint256) {
        return tasksCompleted[user];
    }

    function getBadgesMinted(address user) external view returns (uint256) {
        return badgesMinted[user];
    }
}
