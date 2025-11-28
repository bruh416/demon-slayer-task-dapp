const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TaskSlayer end-to-end flow", function () {
  let token, badge, manager;
  let owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("SlayerToken");
    token = await Token.deploy(ethers.parseUnits("100000", 18));
    await token.deployed();

    const Badge = await ethers.getContractFactory("SlayerBadge");
    badge = await Badge.deploy();
    await badge.deployed();

    const Manager = await ethers.getContractFactory("TaskManager");
    manager = await Manager.deploy(token.target, badge.target, ethers.parseUnits("2", 18), 3);
    await manager.deployed();

    // transfer badge ownership to manager so mintBadge is callable
    await badge.transferOwnership(manager.target);
    // set manager as token minter
    await token.setTaskMinter(manager.target);
  });

  it("mints tokens on task and mints badge at milestone", async function () {
    // user completes a task
    await manager.connect(user).markTaskDone("");
    expect(await token.balanceOf(user.address)).to.equal(ethers.parseUnits("2", 18));

    // complete two more tasks (milestone = 3)
    await manager.connect(user).markTaskDone("");
    await manager.connect(user).markTaskDone("https://example.com/badge/1");

    // after 3 tasks: balance == 6, badge minted count == 1
    expect(await token.balanceOf(user.address)).to.equal(ethers.parseUnits("6", 18));
    expect(await manager.getBadgesMinted(user.address)).to.equal(1);
  });
});
