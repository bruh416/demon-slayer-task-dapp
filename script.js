// FINAL WORKING VERSION – NO METAMASK NEEDED (Remix VM)
const TOKEN_ADDRESS   = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const BADGE_ADDRESS   = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";
const MANAGER_ADDRESS = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";

const provider = new ethers.providers.JsonRpcProvider("https://remix.ethereum.org/rpc");
const signer = provider.getSigner("0x0000000000000000000000000000000000000001"); // Remix VM account

let token, badge, manager;

const tokenABI = ["function balanceOf(address) view returns (uint256)"];
const badgeABI = ["function balanceOf(address) view returns (uint256)"];
const managerABI = [
  "function markTaskDone(string badgeMetadataURI) external",
  "function getTasksCompleted(address) view returns (uint256)",
  "function getBadgesMinted(address) view returns (uint256)"
];

async function init() {
  token   = new ethers.Contract(TOKEN_ADDRESS, tokenABI, signer);
  badge   = new ethers.Contract(BADGE_ADDRESS, badgeABI, signer);
  manager = new ethers.Contract(MANAGER_ADDRESS, managerABI, signer);

  document.getElementById("connect-btn").innerText = "VM Connected";
  document.getElementById("walletStatus").innerText = "Connected (Remix VM)";

  updateDashboard();
}

async function updateDashboard() {
  const addr = await signer.getAddress();
  const tasks   = await manager.getTasksCompleted(addr);
  const badges  = await manager.getBadgesMinted(addr);
  const balance = ethers.utils.formatEther(await token.balanceOf(addr));

  document.querySelectorAll(".card h2")[0].innerText = tasks + " Tasks";
  document.querySelectorAll(".card h2")[1].innerText = badges + " Badges";
  document.querySelectorAll(".card h2")[2].innerText = parseFloat(balance).toFixed(2) + " SLAY";
}

async function slayTask() {
  document.getElementById("txStatus").innerText = "Slaying task…";
  const tx = await manager.markTaskDone("ipfs://badge-" + Date.now());
  await tx.wait();
  document.getElementById("txStatus").innerText = "Task slayed! +5 SLAY & badge check";
  updateDashboard();
}

window.addEventListener("load", init);