# GGBoard 🎮 ⚔️

**GGBoard** is a decentralized, on-chain gaming scoreboard deployed on **Botchain Mainnet (Chain ID: 677)**. Gamers register immutable gaming profiles, record 1v1 match results, peer-verify outcomes with cryptographic confirmation, track battle statistics, and compete on a transparent public leaderboard.

---

## ⚡ Core Architecture

- **Strict Single-Page App**: Exactly ONE responsive web page using Next.js App Router (zero additional routes).
- **Single Smart Contract**: All profiles, match records, peer confirmations, and rankings live exclusively in `contracts/GGBoard.sol`.
- **Zero Backend / Zero Databases**: Fully decentralized and trustless; all statistics and history are fetched directly from the Botchain blockchain.
- **Anti-Cheat Verification Protocol**: A recorded match creates a `Pending` record and **never** affects wins, losses, or ranking until the opponent explicitly confirms or rejects the result from their own wallet.

---

## 🌐 Network Specifications (Botchain Mainnet)

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Native Token** | `BOT` (18 Decimals) |
| **Total Supply** | `150,000,000 BOT` |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Mainnet Contract** | [`0x5e1ae0a3D053755BB203894dC6C97B951254a7A0`](https://scan.botchain.ai/address/0x5e1ae0a3D053755BB203894dC6C97B951254a7A0#code) |

---

## 🛠️ Tech Stack

- **Smart Contract**: Solidity `^0.8.20`, Hardhat, OpenZeppelin
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Web3 Integration**: wagmi v2, viem v2, MetaMask Injected Connector
- **Design**: Cyber-gaming aesthetics, deep charcoal background (`#090a0e`), electric orange accent (`#ff6200`), warm off-white typography, HUD telemetry borders.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm
- MetaMask browser extension installed

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Contract Unit Tests
Includes 15 unit tests covering profile registration, duplicate prevention, match submission, opponent confirmations, rejections, unauthorized calls, and leaderboard tiebreakers:
```bash
npx hardhat test
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate `.env` with your deployment private key:
```env
PRIVATE_KEY=your_private_key_here
BOTCHAIN_MAINNET_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5e1ae0a3D053755BB203894dC6C97B951254a7A0
NEXT_PUBLIC_CHAIN_ID=677
```

### 5. Deploy Contract to BOT Chain Mainnet
```bash
npm run deploy:mainnet
```
The script deploys `GGBoard.sol`, confirms the transaction, verifies gas usage, and outputs the contract artifact and address to `src/contracts/GGBoardDeployment.json`.

### 6. Run the Next.js Frontend
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Features & Sections

1. **Top Navigation**: Logo, smooth section anchors, live Botchain network status, auto-switch prompt, and MetaMask connect button.
2. **Hero Section**: Headline *"Your Game. Your Record. Your Glory."*, total registered gamers counter, total matches recorded counter, and live podium preview.
3. **Gaming Profile**:
   - Register gamer handle (1-32 characters, 1 per wallet).
   - Display username, truncated wallet address with copy button and Botchain explorer link.
   - Total wins, total losses, total matches, and win rate percentage bar.
4. **Record a Match**:
   - Opponent wallet address input (with quick-select rival shortcuts).
   - Submitter and opponent score inputs.
   - Real-time projected winner calculation.
   - Opponent must confirm result before statistics update.
5. **Pending Matches**:
   - Shows all matches awaiting peer confirmation.
   - When the connected wallet is the opponent: provides **Confirm Result** and **Reject Result** buttons.
   - When submitter: displays "Waiting for Opponent" status.
6. **Public Leaderboard**:
   - Real-time on-chain ranked players by total wins.
   - Tie-breaking rules: higher wins, then fewer losses, then registration timestamp.
   - Gold/Silver/Bronze highlight badges for top 3 champions.
7. **Match History**:
   - Complete match records feed.
   - Visual win/loss badges (Green for wins, Red for losses).
   - Filter tabs: *All Matches*, *My Matches*, *Confirmed*, *Rejected*, plus search bar.

---

## 🔒 Security & Rules Enforced On-Chain

- `registerProfile`: Validates username length (1-32) and prevents duplicate registration from the same wallet address.
- `submitMatch`: Prevents playing against self (`msg.sender != opponent`), verifies opponent is registered, and prevents tied scores.
- `confirmMatch`: Only the designated opponent (`playerTwo == msg.sender`) can confirm a pending match. Once confirmed, status changes to `Confirmed` and prevents double execution.
- `rejectMatch`: Only the designated opponent can reject an incorrect match. Statistics are never altered.
