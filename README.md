# Demon Slayer - Task Slayer dApp

**Theme:** Demon Slayer (Anime-inspired dark purple cyberpunk aesthetic)  
**Student:** [Your Full Name]  
**Submission Date:** November 28, 2025

## Project Overview
A fully functional blockchain-based task completion dApp where users "slay" real-life tasks to earn:
- **SLAY** - ERC-20 reward token (5 SLAY per task)
- **Slayer Badges** - ERC-721 NFTs minted every 3 tasks (milestone system)

## Key Features
- Beautiful gradient purple design with glowing cards and hover effects
- Wallet connection (auto-connected in demo)
- Real-time dashboard showing:
  - Total tasks completed
  - Badges (NFTs) earned
  - SLAY token balance
- One-click "I SLAYED THIS TASK!" button that:
  - Increases task count
  - Awards 5 SLAY tokens
  - Mints exclusive NFT badge every 3rd task

## Smart Contracts (Deployed on Remix VM)
| Contract       | Address                                      | Type     | Purpose                          |
|----------------|----------------------------------------------|----------|----------------------------------|
| SlayerToken    | `0xd9145CCE52D386f254917e481eB44e9943F39138` | ERC-20   | Reward token (SLAY)              |
| SlayerBadge    | `0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8` | ERC-721  | Milestone NFT badges             |
| TaskManager    | `0xf8e81D47203A594245E36C48e151709F0C19fBe8` | Logic    | Main contract - handles rewards & badges |

## Technology Stack
- **Frontend:** HTML, CSS, JavaScript (ethers.js via CDN)
- **Blockchain:** Solidity 0.8.20 + OpenZeppelin contracts
- **Development:** Remix IDE (no Hardhat/Truffle needed)
- **Deployment:** Remix Ethereum VM (Shanghai)

## How It Works
1. User connects wallet (auto-connected in demo)
2. Clicks "I SLAYED THIS TASK!"
3. TaskManager contract:
   - Increments task counter
   - Mints 5 SLAY tokens
   - Every 3rd task → mints unique Slayer Badge NFT

## Screenshots Included
- `remix-deployed.png` → All 3 contracts deployed
- `screenshot-1.png` → Initial dashboard (100,035 SLAY)
- `screenshot-2.png` → After completing 3 tasks (badge minted)

## Folder Structure