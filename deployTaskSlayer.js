const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  // 1) Deploy SlayerToken with initial supply (100_000 * 10^18)
  const Token = await hre.ethers.getContractFactory("SlayerToken");
  const initialSupply = hre.ethers.parseUnits("100000", 18);
  const token = await Token.deploy(initialSupply);
  await token.deployed();
  console.log("SlayerToken deployed:", token.target);

  // 2) Deploy SlayerBadge (ERC721)
  const Badge = await hre.ethers.getContractFactory("SlayerBadge");
  const badge = await Badge.deploy();
  await badge.deployed();
  console.log("SlayerBadge deployed:", badge.target);

  // 3) Deploy TaskManager: reward 5 SLAY per task, milestone every 5 tasks
  const rewardPerTask = hre.ethers.parseUnits("5", 18);
  const milestoneThreshold = 5;
  const Manager = await hre.ethers.getContractFactory("TaskManager");
  const manager = await Manager.deploy(token.target, badge.target, rewardPerTask, milestoneThreshold);
  await manager.deployed();
  console.log("TaskManager deployed:", manager.target);

  // 4) Transfer ownership of badge contract to TaskManager so it can mint badges
  const tx1 = await badge.transferOwnership(manager.target);
  await tx1.wait();
  console.log("Badge ownership transferred to TaskManager");

  // 5) Set TaskManager as authorized minter in SlayerToken
  const tx2 = await token.setTaskMinter(manager.target);
  await tx2.wait();
  console.log("TaskManager set as token minter");

  console.log("==== Deployment finished ====");
  console.log("SlayerToken:", token.target);
  console.log("SlayerBadge:", badge.target);
  console.log("TaskManager:", manager.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
