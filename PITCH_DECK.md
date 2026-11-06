# GGBOARD — PITCH DECK

**Tagline:** Your Game. Your Record. Your Glory.  
**Elevator Pitch:** The decentralized, peer-verified competitive gaming scoreboard on Botchain where matches, statistics, and leaderboards are 100% permanently recorded on-chain.  
**Live Network:** Botchain Testnet (Chain ID: 968)  
**Contract Address:** `0x2b71aC6efA1b587C8Bf08881A0eb79cc72D34261`  
**Explorer:** [https://scan.bohr.life/address/0x2b71aC6efA1b587C8Bf08881A0eb79cc72D34261#code](https://scan.bohr.life/address/0x2b71aC6efA1b587C8Bf08881A0eb79cc72D34261#code)  

---

## 📽️ SLIDE 1: Title & Vision
* **Headline:** GGBOARD
* **Sub-headline:** The Decentralized Competitive Gaming Ledger
* **Tagline:** Your Game. Your Record. Your Glory.
* **Key Visual:** Electric Orange (#ff6200) glowing GG monogram on deep charcoal background.
* **Core Value:** Trustless, peer-verified 1v1 match results and permanent on-chain leaderboards for competitive esports.

---

## ⚠️ SLIDE 2: The Problem
* **Centralized Data Fragility:** When tournament sites or platforms shut down, players lose years of match achievements and records.
* **Unilateral Score Fraud:** Players falsify self-reported match scores, leading to disputes, admin bottlenecks, and ruined competitive integrity.
* **Web3 Gaming Bloat:** Traditional Web3 projects force unwanted tokens, speculative NFTs, and pay-to-play paywalls on gamers who just want proof of skill.

---

## 💡 SLIDE 3: The Solution — GGBoard
* **Permanent On-Chain Identity:** Gamers register an immutable gamer tag permanently tied to their wallet.
* **Peer-Verified Anti-Cheat Protocol:** A match never affects player stats or rank until the opponent confirms the score from their wallet.
* **Pure Utility, No Token Gimmicks:** Zero speculative token barriers, zero platform fees, zero centralized databases.
* **100% On-Chain State:** All rankings, stats, and histories are computed directly by the smart contract.

---

## ⚙️ SLIDE 4: How It Works (The 3-Step Flow)

```
[ Step 1: Submit ] ──> Submitter logs scores & opponent address
                       └──> Contract generates PENDING record

[ Step 2: Verify ] ──> Opponent reviews from their connected wallet
                       └──> Chooses "Confirm Result" or "Reject Result"

[ Step 3: Record ] ──> Only upon confirmation:
                       └──> Winner's Wins +1, Loser's Losses +1
                       └──> Standings dynamically re-rank on-chain
```

---

## 🖥️ SLIDE 5: The Product (Live Single-Page Web3 dApp)
* **Single-Page Architecture:** Everything accessible on one responsive webpage—zero route lag.
* **Sleek Cyber-Gaming UI:** High-contrast charcoal and electric orange HUD interface tailored for gamers.
* **Core Modules:**
  1. **Hero & Telemetry:** Real-time counters for registered fighters and verified matches.
  2. **Gamer Profile:** On-chain identity card with win/loss counters and visual win rate bar.
  3. **Match Submission:** Quick rival selector, numeric inputs, and live projected outcome.
  4. **Pending Action Queue:** Real-time alert feed for matches requiring confirmation.
  5. **Dynamic Leaderboard:** Top 3 Gold/Silver/Bronze podium + searchable global standings.
  6. **Immutable Ledger:** Full match history with green/red win/loss indicators.

---

## 🏗️ SLIDE 6: Tech Architecture & Security

* **Smart Contract:** `GGBoard.sol` (Solidity 0.8.20, EVM Paris, gas-optimized)
* **Testing:** 15 automated unit tests with 100% passing rate.
* **Strict Invariants:**
  * Prevention of self-matches (`msg.sender != opponent`)
  * Duplicate wallet registration lock
  * Only the designated opponent can confirm or reject
  * In-memory sorting for zero-gas leaderboard reads
* **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS, wagmi v2, viem v2.

---

## 🌐 SLIDE 7: Why Botchain?
* **Sub-Second Block Times:** Gamers experience instant submission and confirmation responsiveness.
* **Ultra-Low Gas Costs:** Micro-cents per transaction make logging every casual or ranked match viable.
* **AI Ecosystem Synergies:** Future integration with `@botchain_ai` autonomous agents for matchmaking, predictive analytics, and automated tournament adjudication.

---

## 📊 SLIDE 8: Current Traction & Status
* **Status:** ✅ Mainnet-ready contract deployed & verified on Botchain Testnet.
* **Contract Address:** `0x2b71aC6efA1b587C8Bf08881A0eb79cc72D34261`
* **Testnet Chain ID:** `968`
* **Explorer Verification:** 100% verified source code on Bohr Scan.
* **Repository:** Publicly available on GitHub with complete deployment scripts & test suite.

---

## 🚀 SLIDE 9: Roadmap
* **Phase 1 (Complete):** Core protocol, peer-verification engine, responsive one-page dApp, Botchain deployment.
* **Phase 2 (Q1 2027):** Smart contract single-elimination tournament brackets & clan/guild leaderboards.
* **Phase 3 (Q2 2027):** Lightweight game developer SDK (Unity / Unreal Engine) for automated match reporting.
* **Phase 4 (Q3 2027):** AI-powered competitive matchmaking and automated dispute analysis via Botchain AI.

---

## 🤝 SLIDE 10: Summary & Links
* **Mission:** Establish the universal, trustless competitive gaming record for Web3.
* **Live App:** Localhost / Vercel ready
* **Smart Contract:** `0x2b71aC6efA1b587C8Bf08881A0eb79cc72D34261`
* **Explorer Link:** [scan.bohr.life/address/0x2b71aC6efA1b587C8Bf08881A0eb79cc72D34261](https://scan.bohr.life/address/0x2b71aC6efA1b587C8Bf08881A0eb79cc72D34261)
* **GitHub:** [github.com/liljhnxn/ggboard](https://github.com/liljhnxn/ggboard)
* **Contact & Community:** `@botchain_ai` Ecosystem
